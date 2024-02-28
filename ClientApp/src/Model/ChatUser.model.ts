export class ChatUser {
    constructor(
      public userName: string,
      public displayName: string,
      public avartar: string,
      public currentRoom: string,
      public device: string
    ) { }
  }