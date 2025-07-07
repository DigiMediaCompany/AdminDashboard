import { HelmetProvider, Helmet } from "react-helmet-async";
import {constants} from "../../utils/constants.ts";

const PageMeta = ({
  title = constants.SITE_METADATA.TITLE,
  description = constants.SITE_METADATA.DESCRIPTION,
}: {
  title?: string;
  description?: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
