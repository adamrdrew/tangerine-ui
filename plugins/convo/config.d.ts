export interface Config {
  
  /** @deepVisibility frontend */
  convoFrontend?: {
    type: object;
    /** @visibility frontend */
    title?: string;

    /** @visibility frontend */
    highlightColor?: string;

    /** @items.visibility frontend */
    welcomePrompts?: {
      /** @visibility frontend */
      title?: string;
      /** @visibility frontend */
      prompt?: string;
    }[];
    /** @deepVisibility frontend */
    safetyMessage?: {
      /** @visibility frontend */
      title: string;
      /** @visibility frontend */
      content: string;
    };
  };
}
