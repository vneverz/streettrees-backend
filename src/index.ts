export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	  const url = new URL(request.url);
	  const corsHeaders = {
		"Access-Control-Allow-Origin": "http://localhost:5173",
		"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	  };

	  // CORS 預檢請求
	  if (request.method === "OPTIONS") {
		return new Response(null, {
		  status: 204,
		  headers: corsHeaders,
		});
	  }

	  // GET /trees → 取得所有資料
	  if (request.method === "GET" && url.pathname === "/trees") {
		try {
		  const { results } = await env.DB.prepare(
			"SELECT * FROM street_trees ORDER BY created_at DESC"
		  ).all();
		  return Response.json(results, { headers: corsHeaders });
		} catch (err) {
		  return new Response(`DB Error: ${err}`, { status: 500, headers: corsHeaders });
		}
	  }

	  // POST /trees → 新增一筆資料
	  if (request.method === "POST" && url.pathname === "/trees") {
		try {
		  const data = (await request.json()) as {
			species: string;
			age: number | null;
			location: string;
			district: string;
			photo: string | null;
			description: string;
		  };
		  const { species, age, location, district, photo, description } = data;

		  await env.DB.prepare(
			`INSERT INTO street_trees (species, age, location, district, photo, description)
			 VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
		  )
			.bind(species, age, location, district, photo, description)
			.run();

		  return new Response("Tree inserted successfully", { status: 201, headers: corsHeaders });
		} catch (err) {
		  return new Response(`Insert Error: ${err}`, { status: 500, headers: corsHeaders });
		}
	  }

	  // 預設回傳
	  return new Response("Not Found", { status: 404, headers: corsHeaders });
	},
  } satisfies ExportedHandler<Env>;
