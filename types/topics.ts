import { ThemeColor } from "./theme";

export type Topic = {
  id: string;
  title: string;
  subject: { id:string, name: string ,theme: ThemeColor | null;};
  class: { id:string, name: string };
  description:string | null;
  student_progress:  [{completed: boolean } | null];
  order_index : number;
};