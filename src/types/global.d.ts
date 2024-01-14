declare module '_bot' {
  import childProcess from 'child_process';

  export interface IChildBot extends childProcess.ChildProcess {
    command?: (message: string) => Promise<unknown>
  }
}

type botName = 'Kladr';

type BotState = 'run' | 'wait';

interface IBot {
  send(data: unknown): void
  parentSend(message: string): void
  getState(): {
    state: BotState
    error?: string
  }
}
