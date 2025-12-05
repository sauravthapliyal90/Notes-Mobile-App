
// declare module "*.jpeg" {
//   const asset: ImageSourcePropType;
//   export default asset;
// }

// declare module "*.jpg" {
//   const asset: ImageSourcePropType;
//   export default asset;
// }

// declare module "*.png" {
//   const asset: ImageSourcePropType;
//   export default asset;
// }

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.jpeg" {
  const content: any;
  export default content;
}

// declare module "*.svg" {
//   const content: any;
//   export default content;
// }

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}