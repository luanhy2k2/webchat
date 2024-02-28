export class ChatMessage {
    constructor(
      public content: string,
      public timestamp: string,
      public user: string,
      public isMine: boolean,
      public avartar: string
    ) { }
  }
  