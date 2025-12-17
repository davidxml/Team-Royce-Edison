import { ThemeColor } from "./theme";

type ClassSubject = {
  id: string;
  class: {
    id: string;
    name: string;
    order_no: number;
  };
  subject: {
    category: string;
    created_at: string;
    description: string | null;
    id: string;
    image: string;
    name: string;
    theme: ThemeColor | null;
  };
}

export type ClassSubjectResponse = ClassSubject[]