import { ITEMS } from "../utils/mockdata";

export default function Card(props: { item: typeof ITEMS[number] }) {
  return (
    <div className="border w-[300px] shadow rounded bg-white">
      <img
        src={props.item.img}
        className="w-[300px] aspect-video object-cover"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold">{props.item.title}</h2>
        <p className="text-gray-500">{props.item.description}</p>
      </div>
      <div className="w-full p-2">
        <button className="bg-black rounded text-white p-2 w-full hover:bg-neutral-700 transition">
          View Info
        </button>
      </div>
    </div>
  );
}
