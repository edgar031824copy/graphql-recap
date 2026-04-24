export type Job = {
  id: string;
  title: string;
  description?: string;
  date: string;
  company: {
    id: string;
    name: string;
  };
};
