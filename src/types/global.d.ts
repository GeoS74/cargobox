declare module '_bot' {
  import childProcess from 'child_process';

  export interface IChildBot extends childProcess.ChildProcess {
    command?: (message: string) => Promise<unknown>
  }
}

type botName = 'Kladr';

interface IBot {
  state: "run" | "wait"
  error?: Error
  
  send(data: unknown): void
  parentSend(message: string): void

  getState(): {
    state: Bot.state
    error?: Error
  }
}


