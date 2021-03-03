import { plugins } from "@webiny/plugins";
import imageComponent from "@webiny/app/plugins/image";
import pageBuilder from "./pageBuilder";
import formBuilder from "./formBuilder";
import authorizationHeaderLink from "./authorizationHeaderLink";

import theme from "theme";

plugins.register([imageComponent(), pageBuilder, formBuilder, theme(), authorizationHeaderLink]);
