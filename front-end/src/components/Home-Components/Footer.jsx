import githubLogo from "../../assets/github-mark-white.png";

function Footer() {
  return (
    <footer>
      <p>© 2023 BigBobs LLC</p>
      <a
        href="https://github.com/BigBobandy"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={githubLogo} alt="GitHub" width="32" height="32" />
      </a>
    </footer>
  );
}
export default Footer;
