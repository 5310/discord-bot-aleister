install:
	deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts

typecheck: install
	deployctl check https://deno.land/x/deploy/examples/hello.js

dev: install
	deployctl run --watch ./main.ts
	
run: typecheck
	deployctl run --watch ./main.ts

deploy: typecheck
	deno --allow-read --allow-write --allow-env --allow-net --allow-run ./deploy.ts
	deployctl upgrade
