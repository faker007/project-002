import { faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { routes } from "../utils/constants";

export const FaceBookLogo: React.FC = () => {
  return (
    <a href={routes.faceBook} target="_blank">
      <FontAwesomeIcon icon={faFacebookF} />
    </a>
  );
};

export const TwitterLogo: React.FC = () => {
  return (
    <a href={routes.twitter} target="_blank">
      <FontAwesomeIcon icon={faTwitter} />
    </a>
  );
};

export const LinkLogo: React.FC<{ url: string }> = ({ url }) => {
  return (
    <a href={url} target="_blank">
      <FontAwesomeIcon icon={faLink} />
    </a>
  );
};
