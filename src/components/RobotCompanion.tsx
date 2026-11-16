"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./RobotCompanion.module.css";

export default function RobotCompanion() {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ speaking: false, listening: false, paused: false, action: "", start: 0, until: 0 });
  const [intro, setIntro] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [right, setRight] = useState(false);
  const [paused, setPaused] = useState(false);
  const [label, setLabel] = useState("Hello! I’m Mitra");
  const tip = useRef(0);
  function perform(action: string) {
    Object.assign(state.current, { action, start: performance.now(), until: performance.now() + 3500 });
    setLabel(action === "dance" ? "Happy dance time!" : action === "spin" ? "Around we go!" : "Hello, practice pal!");
  }
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 3200);
    const update = (event: Event) => {
      const { kind, active } = (event as CustomEvent<{ kind: "speaking" | "listening"; active: boolean }>).detail;
      state.current[kind] = active;
      setLabel(state.current.listening ? "I’m listening…" : state.current.speaking ? "Listen with me" : "Ready when you are");
    };
    const result = (event: Event) => {
      const success = (event as CustomEvent<{ success: boolean }>).detail.success;
      Object.assign(state.current, { action: success ? "dance" : "nod", start: performance.now(), until: performance.now() + 4000 });
      setLabel(success ? "Lovely pronunciation! ✨" : "Take your time. I’m with you!");
    };
    window.addEventListener("mitra-activity", update); window.addEventListener("mitra-result", result);
    return () => { clearTimeout(timer); window.removeEventListener("mitra-activity", update); window.removeEventListener("mitra-result", result); };
  }, []);
  useEffect(() => {
    if (hidden || !host.current) return;
    const mount = host.current;
    let disposed = false;
    let cleanup = () => {};
    void import("three").then(T => {
      if (disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { mount.textContent = "🤖"; return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(240, 260); mount.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 240 / 260, 0.1, 30); camera.position.set(0, .4, 7.5); camera.lookAt(0, 0, 0);
      scene.add(new T.HemisphereLight(0xd9faff, 0x89796c, 2.6));
      const key = new T.DirectionalLight(0xffffff, 4); key.position.set(-3, 4, 5); scene.add(key);
      const rim = new T.DirectionalLight(0x42e3e4, 3); rim.position.set(3, 1, -2); scene.add(rim);
      const white = new T.MeshStandardMaterial({ color: 0xf3f0e8, roughness: .28, metalness: .18 });
      const teal = new T.MeshStandardMaterial({ color: 0x1eb6bf, roughness: .25, metalness: .35 });
      const dark = new T.MeshStandardMaterial({ color: 0x142d40, roughness: .3, metalness: .6 });
      const glass = new T.MeshStandardMaterial({ color: 0x071c38, roughness: .12, metalness: .5 });
      const glow = new T.MeshStandardMaterial({ color: 0x8cffff, emissive: 0x24ddff, emissiveIntensity: 2 });
      const robot = new T.Group(); scene.add(robot);
      type Group = InstanceType<typeof T.Object3D>;
      type Material = InstanceType<typeof T.MeshStandardMaterial>;
      function oval(parent: Group, material: Material, x: number, y: number, z: number, sx: number, sy: number, sz: number) {
        const mesh = new T.Mesh(new T.SphereGeometry(1, 28, 20), material);
        mesh.position.set(x,y,z); mesh.scale.set(sx,sy,sz); parent.add(mesh); return mesh;
      }
      function hoop(parent: Group, material: Material, radius: number, tube: number, x: number, y: number, z: number) {
        const mesh = new T.Mesh(new T.TorusGeometry(radius,tube,12,48),material); mesh.position.set(x,y,z); parent.add(mesh); return mesh;
      }
      oval(robot,white,0,-.45,0,.65,.72,.46);
      oval(robot,dark,0,-.38,.42,.4,.4,.09);
      oval(robot,teal,0,-.38,.49,.34,.34,.07);
      hoop(robot,glow,.17,.025,0,-.36,.56);
      oval(robot,glow,0,-.36,.57,.065,.065,.025);
      for (let i=-1;i<=1;i++) oval(robot,dark,i*.13,-.82,.36,.035,.05,.025);
      const neck = hoop(robot,dark,.25,.07,0,.05,0); neck.rotation.x=Math.PI/2;
      const head = new T.Group(); head.position.y=.65; robot.add(head);
      oval(head,white,0,0,0,.94,.75,.59);
      oval(head,teal,0,0,.4,.81,.57,.24);
      oval(head,glass,0,0,.46,.76,.52,.24);
      const eyes=[-.3,.3].map(x=>oval(head,glow,x,.07,.7,.115,.16,.045));
      const mouth=oval(head,glow,0,-.24,.7,.18,.035,.025);
      [-1,1].forEach(side=>{
        oval(head,dark,side*.91,0,0,.15,.3,.3);
        oval(head,teal,side*1.01,0,0,.1,.24,.24);
        oval(head,white,side*1.08,0,0,.045,.16,.16);
        oval(head,glow,side*.53,-.23,.65,.075,.025,.025);
        oval(head,white,side*.58,.32,.59,.025,.025,.02);
      });
      oval(head,teal,0,.8,0,.045,.18,.045); oval(head,glow,0,.98,0,.1,.1,.1);
      const arms=[-1,1].map(side=>{
        const pivot=new T.Group(); pivot.position.set(side*.64,-.12,0); robot.add(pivot);
        oval(pivot,dark,side*.06,0,0,.17,.17,.17);
        oval(pivot,white,side*.16,-.22,0,.2,.3,.22);
        oval(pivot,teal,side*.21,-.43,0,.16,.07,.17);
        oval(pivot,white,side*.23,-.55,.02,.17,.14,.17);
        for(let i=-1;i<=1;i++) oval(pivot,white,side*.23+i*.09,-.69,.07,.037,.1,.055);
        return pivot;
      });
      const nozzle=hoop(robot,dark,.24,.07,0,-1.08,0); nozzle.rotation.x=Math.PI/2;
      const jet=oval(robot,glow,0,-1.31,0,.17,.3,.17);
      const ring=hoop(scene,teal,.67,.025,0,-1.72,0); ring.rotation.x=Math.PI/2;
      const sparks=Array.from({length:8},(_,i)=>oval(scene,glow,0,-1.5,0,.018+i%2*.012,.018,.018));
      const reduced=matchMedia("(prefers-reduced-motion: reduce)");
      let frame=0, nextAction=0, idle=0;
      const start=performance.now();
      const draw=(now:number)=>{
        frame=requestAnimationFrame(draw); if(document.hidden)return;
        const t=(now-start)/1000;
        const {speaking,listening,paused,action,until}=state.current;
        const quiet=reduced.matches||paused;
        if(t>nextAction){idle=Math.floor(Math.random()*5);nextAction=t+5+Math.random()*4;}
        const active=now<until?action:"";
        const free=!speaking&&!listening;
        const dance=free&&(active==="dance"||(!active&&idle===3));
        const wave=free&&(active==="wave"||(!active&&idle===1));
        const p=Math.min(1,Math.max(0,(now-state.current.start)/3500));
        robot.position.set(!quiet&&dance?Math.sin(t*3)*.12:0,quiet?0:Math.sin(t*2)*.08+(dance?Math.abs(Math.sin(t*5))*.15:0),0);
        robot.rotation.set(0,quiet?0:free&&active==="spin"?Math.PI*2*p*p*(3-2*p):Math.sin(t*.8)*(idle===2?.5:.15),!quiet&&dance?Math.sin(t*7)*.13:0);
        head.rotation.z=quiet?0:Math.sin(t*1.4)*(listening?.12:.04);
        head.rotation.x=!quiet&&free&&(active==="nod"||(!active&&idle===4))?Math.sin(t*4)*.12:0;
        arms[0].rotation.z=quiet?-.15:wave||dance?-1.9+Math.sin(t*8)*.3:-.15+Math.sin(t*2)*.12;
        arms[1].rotation.z=quiet?.15:dance?1.9-Math.sin(t*8)*.3:speaking?.8+Math.sin(t*5)*.25:.15;
        eyes.forEach(eye=>{eye.scale.y=!quiet&&Math.sin(t*1.1)>.995?.025:.16;});
        mouth.scale.y=speaking&&!quiet?.06+Math.abs(Math.sin(t*11))*.09:.035;
        jet.scale.y=quiet?.3:.28+Math.sin(t*13)*.06;
        glow.emissive.setHex(listening?0x65eead:dance?0xffbc52:0x24ddff);
        sparks.forEach((spark,i)=>{spark.visible=!quiet; const a=t+i*Math.PI/4;spark.position.set(Math.cos(a)*.55,-1.5+Math.sin(a*2)*.12,Math.sin(a)*.4);});
        renderer.render(scene,camera);
      };
      frame=requestAnimationFrame(draw);
      cleanup=()=>{cancelAnimationFrame(frame);scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});[white,teal,dark,glass,glow].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{if(!disposed)mount.textContent="🤖";});
    return()=>{disposed=true;cleanup();mount.replaceChildren();};
  },[hidden]);
  if(hidden)return <button className={styles.restore} onClick={()=>setHidden(false)} aria-label="Show Mitra companion">🤖</button>;
  return <aside className={`${styles.companion} ${intro?styles.intro:""}`} style={right&&!intro?{left:"auto",right:12}:undefined} aria-label="Mitra robot companion">
    {menu&&<div className={styles.menu} aria-label="Companion actions" onKeyDown={e=>{if(e.key==="Escape")setMenu(false);}}>
      <strong>Hang out with Mitra</strong>
      <div className={styles.actions}>
        <button onClick={()=>perform("dance")}>♫ Dance</button><button onClick={()=>perform("spin")}>⟳ Spin</button>
        <button onClick={()=>perform("wave")}>Wave hello</button>
        <button onClick={()=>{setRight(!right);setIntro(false);}}>⇄ Switch corner</button>
        <button onClick={()=>{const tips=["Listen once, then repeat at your own pace.","Try slower playback for tricky sounds.","A quiet room helps me hear you.","Short, regular practice is a great start."];setLabel(tips[tip.current++%tips.length]);}}>Practice tip</button>
        <button aria-pressed={paused} onClick={()=>{state.current.paused=!paused;setPaused(!paused);}}>{paused?"Resume":"Pause"} animation</button>
      </div>
      <Link href="/practice" onClick={()=>setMenu(false)}>Start speaking practice →</Link>
      <button onClick={()=>setMenu(false)}>Close menu</button>
    </div>}
    <div className={styles.bubble}>{intro?"Getting ready for a little practice…":label}</div>
    <button className={styles.hide} onClick={()=>{setHidden(true);setIntro(false);setMenu(false);}} aria-label="Hide Mitra companion">×</button>
    <button className={styles.character} onClick={()=>{setMenu(!menu);perform("wave");}} aria-label="Open Mitra actions" aria-expanded={menu}><div ref={host} className={styles.canvas} aria-hidden="true"/></button>
    <span className={styles.name}>{intro?"✦ SWARSAARTHI":"MITRA · YOUR PRACTICE PAL"}</span>
  </aside>;
}

