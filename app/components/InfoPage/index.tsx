import { Paper } from "@/core-components";
import Page from "../Page";
import { Info } from "@mui/icons-material";

export default function InfoPage({ message }: { message: string }) {
  return (
    <Page>
      <Paper elevation={4} className="flex w-full max-w-5xl self-center p-8">
        <div className="flex gap-2">
          <Info color="info"></Info>
          <span>{message}</span>
        </div>
      </Paper>
    </Page>
  );
}
