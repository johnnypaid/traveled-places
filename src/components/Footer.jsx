import styles from "../AppLayout.module.css";

export default function Footer() {
  return (
    <footer>
      <p>&copy; Copyright {new Date().getFullYear()}</p>
    </footer>
  );
}
