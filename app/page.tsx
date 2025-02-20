
export default function Home() {
  return (
    <div className="bg-black text-white h-screen p-10">
      <h1 className="text-[40px]">Доступные формы:</h1>
      <ul>
        <li><a href="/side-effects">1. Побочные эффекты</a></li>
        <li><a href="/contacts">2. Обратная связь</a></li>
      </ul>
    </div>
  );
}
