import App from "../../App";
import config from "../../config";

export function generateStaticParams() {
  return config.map.rooms.map((room) => {
    return { house: room.id };
  });
}

export default function House({
  params: { house },
}: {
  params: { house: string };
}) {
  return <App roomId={house} />;
}
