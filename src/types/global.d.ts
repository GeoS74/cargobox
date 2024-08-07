declare module '_bot' {
  import childProcess from 'child_process';

  export type IChildBotName = 'Kladr' | 'Delline';

  export interface IChildProcess extends childProcess.ChildProcess {
    command?: (message: string) => Promise<unknown>
  }

  export interface IChildBot {
    name: IChildBotName
    process?: IChildProcess
  }
}

type City = {
  code: string
  fullname: string
};

// interface BotState {
//   // state: 'run' | 'wait'
//   // error?: string | undefined;
//   [index: string]: string | number
//   error?: string | undefined
// }

// interface IBot {
//   send(data: unknown): void
//   parentSend(message: string): void
//   getState(): BotState
// }
