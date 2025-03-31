export function GET() {
  return Response.json({ status: 'ok' });
  return Response.json(process.env);
}
