import { useTranslations } from "next-intl";
import config from "../config";
import Markdown from "react-markdown";
import { dedent } from "../text-utils";

export default function About() {
  const t = useTranslations("about");

  let attributions = <></>;
  if (config.attributions) {
    const attributionHeading = t("attribution-heading");
    if (attributionHeading && attributionHeading.trim() !== "") {
      attributions = (
        <>
          <p>{attributionHeading}</p>
          <ul className="list-disc">
            {config.attributions.map((attribution, i) => (
              <li key={i}>
                <Markdown>{attribution}</Markdown>
              </li>
            ))}
          </ul>
        </>
      );
    }
  }

  return (
    <main className="prose prose-default mx-auto p-4 pt-12">
      <p>
        <a href="/">← {t("back")}</a>
      </p>
      <h2>{t("title")}</h2>
      <Markdown>{dedent(config.description)}</Markdown>
      <p className="border-t-2 border-border pt-4">
        {t.rich("powered-by", {
          GitHubLink: () => (
            <a href="https://github.com/ravemz/medley-map">Medley Map</a>
          ),
        })}
      </p>
      <p>
        {t.rich("inspired-by", {
          GitHubLink: () => (
            <a href="https://github.com/aJanuary/concarte">concarte</a>
          ),
        })}
      </p>
      {attributions}
    </main>
  );
}
