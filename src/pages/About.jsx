import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

import Card from "../components/UserCard";
import Gallery3D from "../components/user-3d-rotate/3DComponent";

const About = () => {
  return (
    <div className="bg-black">
      {/* <Card
        name="Sujendran J"
        aboutMe="Passionate Frontend Developer crafting UI/UX magic ✨"
        aboutLink="https://portfolio.sujendran.dev"
        socialLinks={[
          {
            icon: <FaGithub size={16} color="white" />,
            onClick: () =>
              window.open("https://github.com/sujendran", "_blank"),
          },
          {
            icon: <FaLinkedin size={16} color="white" />,
            onClick: () =>
              window.open("https://linkedin.com/in/sujendran", "_blank"),
          },
          {
            icon: <FaInstagram size={16} color="white" />,
            onClick: () =>
              window.open("https://twitter.com/sujendran_dev", "_blank"),
          },
        ]}
      /> */}
      <div>
        <Gallery3D />
      </div>
    </div>
  );
};

export default About;
