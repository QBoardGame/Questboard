import { Title } from "components/Title/Title";
import { useTranslation } from "react-i18next";
import { DesktopHeader } from "./DesktopHeader";
import { Overview } from "features/overview";
import { useAdRemoval } from "features/monetization";
import styles from "./styles/Screen.module.css";
import { PremiumContent } from "./PremiumContent";
import { FreeContent } from "./FreeContent";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {
  const { t } = useTranslation();
  const { isLoading, isSubscribed } = useAdRemoval();

  return (
    <div className={styles.desktop}>
      <DesktopHeader />
      <div className={styles.desktop__container}>
        <header className={`${styles.desktop__header} ${styles.desktop__fit}`}>
          <Title color='white'>
            Current Locale: <b>{t("common.language")} 🌐</b>
            <br />
            {t("components.desktop.header")}
          </Title>
        </header>
        <main className={styles.desktop__main}>
          <Title color='white'>{t("components.desktop.main")}</Title>
          <Overview />
        </main>
        <aside className={styles.desktop__aside}>
          <Title color='white'>{t("components.desktop.aside")}</Title>
          {isSubscribed || isLoading ? <PremiumContent /> : <FreeContent />}
        </aside>
        <footer className={`${styles.desktop__footer} ${styles.desktop__fit}`}>
          <Title color='white'>{t("components.desktop.footer")}</Title>
        </footer>
      </div>
    </div>
  );
};

export default Screen;
