declare module "_bot" {
  import childProcess from 'child_process';

  export interface IChildBot extends childProcess.ChildProcess {
    command?: (message: string) => Promise<unknown>
  }
}

type botName = "Kladr"