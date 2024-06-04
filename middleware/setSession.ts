import { Session, SessionData } from "express-session";
import { User } from "@/types/auth";

interface ISessionProps {
  methode: "Reload" | "Destroy" | "Set";
  session: Session & Partial<SessionData>;
  valueSession?: User;
}

const setSession = ({ methode, session, valueSession }: ISessionProps) => {
  let error: any;

  switch (methode) {
    case "Set":
      session.user = valueSession;

      return {
        error: undefined,
      };
    case "Reload":
      session.reload((err) => {
        if (err) {
          error = err;
        }

        error = undefined;
      });

      return {
        error: error,
      };
    case "Destroy":
      session.destroy((err) => {
        if (err) {
          error = err;
        }

        error = undefined;
      });

      return {
        error: error,
      };
  }
};

export default setSession;
