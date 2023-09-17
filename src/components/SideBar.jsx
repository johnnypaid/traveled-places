import Logo from "./Logo";
import AppNav from "./AppNav";
import styles from "./Sidebar.module.css";
import { Outlet } from "react-router-dom";

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <footer className={styles.footer}>
        <div>
          <p className={styles.copyright}>
            &copy; Copyright {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
