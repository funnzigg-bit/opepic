declare module "node-cron" {
  export type ScheduledTask = {
    start: () => void;
    stop: () => void;
    destroy: () => void;
  };

  const cron: {
    schedule: (expression: string, callback: () => void | Promise<void>) => ScheduledTask;
  };

  export default cron;
}
