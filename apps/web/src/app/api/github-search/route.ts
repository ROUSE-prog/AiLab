export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q?.trim()) {
      return Response.json({ error: "Query is required." }, { status: 400 });
    }

    const githubUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      q
    )}&sort=stars&order=desc&per_page=10`;

    const response = await fetch(githubUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("GitHub search error:", text);

      return Response.json(
        { error: "Failed to search GitHub repositories." },
        { status: 500 }
      );
    }

    const data = await response.json();

    const repos = (data.items || []).map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner?.login,
      description: repo.description,
      stars: repo.stargazers_count,
      html_url: repo.html_url,
    }));

    return Response.json({ repos });
  } catch (error) {
    console.error("GitHub search route error:", error);
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}