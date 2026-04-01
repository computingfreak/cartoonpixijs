const stories = [
  { id: 'toy', label: 'Toy Rescue' },
  { id: 'jungle', label: 'Jungle Rhythm' },
  { id: 'sky', label: 'Sky Patrol' },
  { id: 'frozen', label: 'Frozen Lantern' },
  { id: 'chef', label: 'Mini Chef Time Machine' },
];

const stageHost = document.getElementById('stage');
const controls = document.getElementById('story-buttons');

async function bootstrap() {
  const app = new PIXI.Application();
  await app.init({
    resizeTo: stageHost,
    antialias: true,
    backgroundColor: 0x091126,
  });
  stageHost.appendChild(app.canvas);

  const root = new PIXI.Container();
  app.stage.addChild(root);

  let activeCleanup = null;
  let activeId = stories[0].id;

  function burst(x, y) {
    const particles = [];
    for (let i = 0; i < 25; i += 1) {
      const g = new PIXI.Graphics();
      g.circle(0, 0, 2 + Math.random() * 3).fill(0xffe6a8);
      g.x = x;
      g.y = y;
      g.vx = (Math.random() - 0.5) * 6;
      g.vy = (Math.random() - 0.5) * 6;
      g.life = 45 + Math.random() * 25;
      particles.push(g);
      root.addChild(g);
    }

    const update = () => {
      particles.forEach((p) => {
        p.life -= 1;
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, p.life / 45);
      });

      if (particles.every((p) => p.life <= 0)) {
        app.ticker.remove(update);
        particles.forEach((p) => p.destroy());
      }
    };

    app.ticker.add(update);
  }

  app.canvas.addEventListener('pointerdown', (evt) => {
    const rect = app.canvas.getBoundingClientRect();
    burst(evt.clientX - rect.left, evt.clientY - rect.top);
  });

  function switchStory(id) {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    root.removeChildren().forEach((node) => node.destroy({ children: true }));

    if (id === 'toy') activeCleanup = toyRescue(app, root);
    if (id === 'jungle') activeCleanup = jungleRhythm(app, root);
    if (id === 'sky') activeCleanup = skyPatrol(app, root);
    if (id === 'frozen') activeCleanup = frozenLantern(app, root);
    if (id === 'chef') activeCleanup = miniChef(app, root);
  }

  stories.forEach((story) => {
    const btn = document.createElement('button');
    btn.textContent = story.label;
    btn.className = story.id === activeId ? 'active' : '';
    btn.addEventListener('click', () => {
      activeId = story.id;
      controls.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      switchStory(story.id);
    });
    controls.appendChild(btn);
  });

  switchStory(activeId);
}

function backdrop(root, colors) {
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, 10, 10).fill({
    color: colors[0],
  });
  bg.tint = colors[1];
  bg.width = root.parent.width;
  bg.height = root.parent.height;
  root.addChild(bg);
}

function toyRescue(app, root) {
  backdrop(root, [0x24325a, 0x543888]);
  const w = app.renderer.width;
  const h = app.renderer.height;

  const parallax = [];
  for (let i = 0; i < 3; i += 1) {
    const layer = new PIXI.Container();
    for (let j = 0; j < 12; j += 1) {
      const toy = new PIXI.Graphics();
      toy.roundRect(0, 0, 40 + i * 12, 18 + i * 8, 5).fill(0xffb347 - i * 0x111111);
      toy.x = j * 95;
      toy.y = h - 70 - i * 55 + Math.random() * 20;
      layer.addChild(toy);
    }
    parallax.push(layer);
    root.addChild(layer);
  }

  const bunny = new PIXI.Graphics();
  bunny.ellipse(0, 0, 24, 30).fill(0xf7f7ff);
  bunny.circle(-10, -30, 9).fill(0xf7f7ff);
  bunny.circle(10, -30, 9).fill(0xf7f7ff);
  bunny.x = w * 0.2;
  bunny.y = h * 0.72;
  root.addChild(bunny);

  let t = 0;
  const update = () => {
    t += 0.03;
    parallax.forEach((layer, i) => {
      layer.x = Math.sin(t * (0.4 + i * 0.12)) * (10 + i * 6);
    });
    bunny.y = h * 0.72 + Math.sin(t * 4) * 8;
    bunny.scale.y = 1 - Math.abs(Math.sin(t * 4)) * 0.12;
  };
  app.ticker.add(update);
  return () => app.ticker.remove(update);
}

function jungleRhythm(app, root) {
  backdrop(root, [0x0f4b33, 0x1d8048]);
  const w = app.renderer.width;
  const h = app.renderer.height;

  const vines = [];
  for (let i = 0; i < 14; i += 1) {
    const v = new PIXI.Graphics();
    v.roundRect(0, 0, 10, h * 0.8, 6).fill(0x2a7f4e);
    v.x = i * (w / 13);
    v.y = -30;
    vines.push(v);
    root.addChild(v);
  }

  const drum = new PIXI.Graphics();
  drum.circle(0, 0, 70).fill(0xcc7b29);
  drum.circle(0, 0, 48).fill(0x8f4e1e);
  drum.x = w * 0.5;
  drum.y = h * 0.75;
  root.addChild(drum);

  let beat = 0;
  const update = () => {
    beat += 0.06;
    vines.forEach((v, i) => {
      v.rotation = Math.sin(beat + i * 0.3) * 0.15;
    });
    const pulse = 1 + Math.max(0, Math.sin(beat * 2.4)) * 0.05;
    drum.scale.set(pulse);
  };

  app.ticker.add(update);
  return () => app.ticker.remove(update);
}

function skyPatrol(app, root) {
  backdrop(root, [0x28407f, 0x7e4ad6]);
  const w = app.renderer.width;
  const h = app.renderer.height;

  const clouds = [];
  for (let i = 0; i < 10; i += 1) {
    const c = new PIXI.Graphics();
    c.ellipse(0, 0, 45 + Math.random() * 25, 20 + Math.random() * 12).fill(0xd6e5ff);
    c.alpha = 0.65;
    c.x = Math.random() * w;
    c.y = Math.random() * h * 0.45;
    c.speed = 0.2 + Math.random() * 0.8;
    clouds.push(c);
    root.addChild(c);
  }

  const pupJet = new PIXI.Graphics();
  pupJet.polygon([-24, -10, 26, 0, -24, 10]).fill(0xffd36e);
  pupJet.circle(-12, 0, 8).fill(0x2c3146);
  pupJet.x = w * 0.2;
  pupJet.y = h * 0.6;
  root.addChild(pupJet);

  const trails = [];
  let t = 0;
  const update = () => {
    t += 0.03;
    clouds.forEach((c) => {
      c.x += c.speed;
      if (c.x > w + 80) c.x = -60;
    });

    pupJet.x = w * 0.2 + (w * 0.55 * (t % (Math.PI * 2))) / (Math.PI * 2);
    pupJet.y = h * 0.55 + Math.sin(t * 2) * 60;

    const trail = new PIXI.Graphics();
    trail.circle(0, 0, 6).fill(0xfff2ad);
    trail.x = pupJet.x - 20;
    trail.y = pupJet.y;
    trail.life = 40;
    trails.push(trail);
    root.addChild(trail);

    trails.forEach((dot) => {
      dot.life -= 1;
      dot.alpha = dot.life / 40;
      dot.scale.set(0.5 + dot.life / 50);
    });

    for (let i = trails.length - 1; i >= 0; i -= 1) {
      if (trails[i].life <= 0) {
        trails[i].destroy();
        trails.splice(i, 1);
      }
    }
  };

  app.ticker.add(update);
  return () => app.ticker.remove(update);
}

function frozenLantern(app, root) {
  backdrop(root, [0x1d3357, 0x2a9bbf]);
  const w = app.renderer.width;
  const h = app.renderer.height;

  const snow = [];
  for (let i = 0; i < 140; i += 1) {
    const s = new PIXI.Graphics();
    s.circle(0, 0, 1 + Math.random() * 3).fill(0xf8fdff);
    s.x = Math.random() * w;
    s.y = Math.random() * h;
    s.speed = 0.3 + Math.random() * 1.8;
    snow.push(s);
    root.addChild(s);
  }

  const lantern = new PIXI.Graphics();
  lantern.roundRect(-18, -28, 36, 56, 8).fill(0xffcb67);
  lantern.circle(0, 0, 10).fill(0xfff1b1);
  lantern.x = w * 0.5;
  lantern.y = h * 0.62;
  root.addChild(lantern);

  const glow = new PIXI.Graphics();
  glow.circle(0, 0, 120).fill(0xffc75a);
  glow.alpha = 0.18;
  glow.x = lantern.x;
  glow.y = lantern.y;
  root.addChild(glow);

  let t = 0;
  const update = () => {
    t += 0.03;
    snow.forEach((s) => {
      s.y += s.speed;
      s.x += Math.sin(t + s.y * 0.02) * 0.35;
      if (s.y > h + 5) {
        s.y = -5;
        s.x = Math.random() * w;
      }
    });

    const pulse = 1 + Math.sin(t * 3) * 0.06;
    glow.scale.set(pulse);
    glow.alpha = 0.15 + (pulse - 1) * 0.5;
  };

  app.ticker.add(update);
  return () => app.ticker.remove(update);
}

function miniChef(app, root) {
  backdrop(root, [0x59336b, 0xa94f7d]);
  const w = app.renderer.width;
  const h = app.renderer.height;

  const portal = new PIXI.Graphics();
  portal.circle(0, 0, 130).stroke({ width: 10, color: 0x8cf3ff });
  portal.circle(0, 0, 90).stroke({ width: 6, color: 0xffd36f });
  portal.x = w * 0.5;
  portal.y = h * 0.5;
  root.addChild(portal);

  const ingredients = [];
  const colors = [0xff6f6f, 0x76f8a3, 0x79bcff, 0xffe170, 0xc891ff];
  for (let i = 0; i < 26; i += 1) {
    const it = new PIXI.Graphics();
    it.roundRect(-7, -7, 14, 14, 4).fill(colors[i % colors.length]);
    it.orbit = 70 + Math.random() * 150;
    it.speed = 0.006 + Math.random() * 0.01;
    it.phase = Math.random() * Math.PI * 2;
    ingredients.push(it);
    root.addChild(it);
  }

  let t = 0;
  const update = () => {
    t += 1;
    portal.rotation += 0.01;
    portal.scale.set(1 + Math.sin(t * 0.03) * 0.05);

    ingredients.forEach((it, i) => {
      const angle = t * it.speed + it.phase;
      it.x = portal.x + Math.cos(angle) * (it.orbit + Math.sin(angle * 3 + i) * 12);
      it.y = portal.y + Math.sin(angle) * (it.orbit * 0.5);
      it.rotation += 0.04;
    });
  };

  app.ticker.add(update);
  return () => app.ticker.remove(update);
}

bootstrap();
