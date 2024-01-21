declare module '_bot' {
  import childProcess from 'child_process';

  export interface IChildBot extends childProcess.ChildProcess {
    command?: (message: string) => Promise<unknown>
  }
}

type botName = 'Kladr';

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
