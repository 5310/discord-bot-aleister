install:
	deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts

typecheck: install
	deployctl check ./main.ts
	deployctl check ./deploy.ts

dev: install
	deployctl run --watch ./main.ts
	
run: typecheck
	deployctl run ./main.ts

deploy: deploy-command deploy-endpoint

deploy-command: typecheck
	deno run --allow-read --allow-write --allow-env --allow-net --allow-run ./deploy.ts

deploy-endpoint: typecheck
	deployctl upgrade