declare module "ion-sound" {}

interface Window {
  ion: {
    sound: {
      play: (name: string) => void;
    } & ((props: {
      sounds: { name: string }[];
      path: string;
      preload: boolean;
      multiplay: boolean;
      volume: number;
    }) => void);
  };
}

declare module "smoothscroll" {
  function scroll(target: HTMLElement | number): void;
  export default scroll;
}
