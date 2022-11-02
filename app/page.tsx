const getPageData = async () => {
  const content = await client.query({
    fetchPolicy: "no-cache",
    query: gql`
      {
        contentByAbsoluteRoute(route: "/") {
          id
          name
          children {
            url
            name
          }
          properties {
            alias
            value {
              ... on GridPropertyValue {
                value
              }
            }
          }
        }
      }
    `,
  });
  return content.data.contentByAbsoluteRoute;
};

import { gql } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { lazy, LazyExoticComponent, Suspense } from "react";
import styles from "../styles/Home.module.css";
import client from "../apollo-client";

export default async function Page() {
  const content = await getPageData();
  const gridJSON = JSON.parse(
    content?.properties.find((x: any) => x.alias === "gridOld").value.value
  );

  const Headline = lazy(() => import("./(components)/headline"));
  const Rte = lazy(() => import("./(components)/rte"));

  const components: {[key: string]: LazyExoticComponent<any>} = {
    headline: Headline,
    rte: Rte,
  };

  const renderComponent = (alias: string, value: string) => {
    const Component = components[alias];
    return (
      <Suspense>
        <Component value={value} />
      </Suspense>
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          {content?.children.map((child: any) => (
            <Link href={child.url} key={child.url}>
              {child.name}
            </Link>
          ))}
        </div>
        <div style={{ display: "grid", width: "100%" }}>
          {gridJSON?.sections?.map((section: any, i: number) => (
            <div style={{ gridColumn: section.grid }} key={i}>
              {section?.rows.map((row: any) =>
                row.areas.map((area: any) =>
                  area.controls.map((control: any) =>
                    renderComponent(control.editor.alias, control.value)
                  )
                )
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
