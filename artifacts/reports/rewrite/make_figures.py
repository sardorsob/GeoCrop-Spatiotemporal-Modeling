"""Regenerate manuscript figures from saved results; no models are refitted.

Run from any directory with Python, numpy, pandas, matplotlib, and Pillow.
"""
from pathlib import Path
import hashlib
import json

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from matplotlib.patches import Patch, Rectangle
import numpy as np
import pandas as pd
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent / "figures"
OUT.mkdir(exist_ok=True)
SOURCES = set()
COLORS = {"corn": "#b46a09", "soy": "#0072b2", "wheat": "#7a5195"}
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10,
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.labelsize": 10, "axes.titlesize": 11, "legend.fontsize": 9,
    "pdf.fonttype": 42, "savefig.facecolor": "white"})

def source(relative):
    p = ROOT / relative
    SOURCES.add(p)
    return p

def table(relative):
    return pd.read_csv(source(relative))

def save(fig, name):
    fig.savefig(OUT / f"{name}.pdf", bbox_inches="tight")
    fig.savefig(OUT / f"{name}.png", dpi=220, bbox_inches="tight")
    plt.close(fig)

def workflow():
    fig, ax = plt.subplots(figsize=(7.0, 2.65))
    ax.set(xlim=(0, 10), ylim=(0, 4.6)); ax.axis("off")
    boxes = [(0.1, 3.2, 2.8, 1.15, "CDL\nAnnual crop labels"),
             (3.6, 3.2, 2.8, 1.15, "MODIS NDVI\nWeekly vegetation"),
             (7.1, 3.2, 2.8, 1.15, "SMAP L4\nWeekly soil moisture"),
             (0.1, 1.55, 2.8, 1.05, "Crop sequences\nRotation patterns"),
             (3.6, 1.55, 2.8, 1.05, "Crop-specific curves\nSeasonal timing"),
             (7.1, 1.55, 2.8, 1.05, "Reference percentiles\nWet / dry conditions"),
             (1.2, 0.0, 7.6, 0.85, "CDL lags + seasonal NDVI and SMAP summaries\nCrop classification, ablations, and error analysis")]
    for x,y,w,h,label in boxes:
        ax.add_patch(Rectangle((x,y),w,h,facecolor="#f4f6f8",edgecolor="#7b8794",lw=0.8))
        ax.text(x+w/2,y+h/2,label,ha="center",va="center",fontsize=10)
    for x in [1.5,5.0,8.5]:
        ax.annotate("",xy=(x,2.62),xytext=(x,3.18),arrowprops={"arrowstyle":"->","color":"#526170","lw":1})
    # The classifier takes summaries from source tables, not fitted curve/anomaly outputs.
    for x, edge, target in [(1.5,0.02,1.6),(5.0,6.75,5.0),(8.5,9.98,8.4)]:
        ax.plot([x,edge,edge],[3.02,3.02,1.1],color="#526170",lw=0.85,ls="--")
        ax.annotate("",xy=(target,0.87),xytext=(edge,1.1),arrowprops={"arrowstyle":"->","color":"#526170","lw":0.85,"ls":"--"})
    save(fig,"workflow")

def phenology():
    df = table("artifacts/tables/task1/hsgp_posterior_phenology.csv")
    fig, ax = plt.subplots(figsize=(7.0,3.35))
    labels = {"corn":"Corn", "soy":"Soybean", "wheat":"Winter wheat"}
    styles = {"corn":"-","soy":"--","wheat":"-."}
    for crop,g in df.groupby("crop",sort=False):
        g=g.sort_values("doy")
        ax.fill_between(g.doy,g.ci_05,g.ci_95,color=COLORS[crop],alpha=0.13,lw=0)
        ax.plot(g.doy,g.posterior_mean,color=COLORS[crop],lw=2,ls=styles[crop],label=labels[crop])
        peak=g.loc[g.posterior_mean.idxmax()]
        ax.plot(peak.doy,peak.posterior_mean,"o",color=COLORS[crop],ms=4)
        ax.annotate(f"Day {int(peak.doy)}",(peak.doy,peak.posterior_mean),
                    xytext=(-16,14 if crop!='soy' else 26),textcoords="offset points",fontsize=9,color=COLORS[crop])
    ax.set(xlabel="Day of year",ylabel="NDVI",xlim=(97,313),ylim=(0.50,1.015))
    ax.legend(loc="lower center",ncol=3,frameon=False)
    ax.grid(axis="y",alpha=.2)
    fig.tight_layout()
    save(fig,"phenology")

def rotation():
    path=source("artifacts/tables/task2/rotation_class_map_smoothed.tif")
    with Image.open(path) as im:
        data=np.array(im)
        sx,sy,_=im.tag_v2[33550]
        _,_,_,x0,y0,_=im.tag_v2[33922]
    counts=np.bincount(data[data!=255],minlength=3)
    assert counts.tolist()==[570202,81308,1432602],counts
    extent=(x0/1e3,(x0+data.shape[1]*sx)/1e3,(y0-data.shape[0]*sy)/1e3,y0/1e3)
    grid=table("artifacts/tables/task2/task2__threshold_sensitivity_grid.csv")
    heat=grid.pivot(index="alternation_min",columns="pattern_dist_max",values="pct_regular")
    fig=plt.figure(figsize=(7.1,4.65))
    gs=fig.add_gridspec(1,2,width_ratios=[1.65,1],wspace=.32)
    ax=fig.add_subplot(gs[0]); bx=fig.add_subplot(gs[1])
    palette=["#0072b2","#d55e00","#c6ad72"]
    cmap=ListedColormap(palette); cmap.set_bad("#f3f3f3")
    ax.imshow(np.ma.masked_equal(data,255),cmap=cmap,norm=BoundaryNorm([-.5,.5,1.5,2.5],3),extent=extent,interpolation="nearest",rasterized=True)
    ax.set_title("a  Smoothed rotation classes",loc="left",fontsize=10)
    ax.set(xlabel="Easting (km)",ylabel="Northing (km)")
    ax.tick_params(labelsize=8)
    ax.plot([extent[0]+120,extent[0]+620],[extent[2]+120]*2,color="#333333",lw=2)
    ax.text(extent[0]+370,extent[2]+155,"500 km",ha="center",fontsize=8)
    ax.legend(handles=[Patch(color=c,label=l) for c,l in zip(palette,["Regular","Monoculture","Irregular"])],
              loc="upper center",bbox_to_anchor=(.5,-.18),ncol=1,frameon=False,fontsize=8)
    m=bx.imshow(heat.to_numpy(),cmap="Blues",vmin=0,vmax=65,aspect="auto")
    bx.set_title("b  Regular share, raw labels",loc="left",fontsize=10)
    bx.set(xticks=range(len(heat.columns)),xticklabels=heat.columns,
           yticks=range(len(heat.index)),yticklabels=[f"{x:.2f}" for x in heat.index],
           xlabel="Maximum mismatches",ylabel="Minimum alternation score")
    for r in range(len(heat.index)):
        for c in range(len(heat.columns)):
            v=heat.iloc[r,c]
            bx.text(c,r,f"{v:.0f}%",ha="center",va="center",fontsize=8,color="white" if v>43 else "#222222")
    bx.add_patch(Rectangle((list(heat.columns).index(3)-.5,list(heat.index).index(.7)-.5),1,1,fill=False,edgecolor="#d55e00",lw=1.6))
    fig.subplots_adjust(bottom=.27,top=.88)
    save(fig,"rotation")

def moisture():
    states=["North Dakota","South Dakota","Minnesota","Nebraska","Iowa","Kansas","Missouri","Wisconsin","Illinois","Michigan","Indiana","Ohio","Kentucky"]
    fig, axes=plt.subplots(1,2,figsize=(7.1,4.25),sharey=True)
    for ax,event,title in zip(axes,["midwest_flood_2019","plains_drought_2022"],
                             ["a  April–July 2019","b  June–August 2022"]):
        d=table(f"artifacts/tables/task3/task3__{event}__anomaly_stats_by_state_crop__20260412.csv")
        for crop,marker,shift,color,label in [("corn","o",-.11,COLORS['corn'],"Corn"),("soybean","s",.11,COLORS['soy'],"Soybean")]:
            g=d[d.crop==crop].set_index("state").loc[states]
            assert g.mean_nig_p_drought.between(0,1).all()
            ax.plot(g.mean_nig_p_drought,np.arange(len(states))+shift,marker,ms=4,color=color,label=label)
        ax.axvline(.5,color="#777777",ls="--",lw=.8)
        ax.set(title=title,xlim=(0,1),xticks=[0,.25,.5,.75,1],xlabel="Mean moisture percentile")
        ax.set_yticks(range(len(states)),states)
        ax.grid(axis="y",alpha=.18)
    axes[0].invert_yaxis()
    axes[1].legend(loc="lower right",frameon=False)
    fig.tight_layout()
    save(fig,"moisture")

def prediction():
    obj=json.loads(source("artifacts/tables/task4/task4__test_metrics__20260413.json").read_text())
    cm=np.array(obj["confusion_matrix"])
    assert cm.sum()==500000 and (cm.sum(axis=1)==125000).all()
    assert abs(np.trace(cm)/cm.sum()-obj['overall_accuracy'])<1e-12
    reg=table("artifacts/tables/task4/task4_regime_stratified_metrics.csv").set_index("rotation_regime").loc[["monoculture","regular","irregular"]]
    assert reg.n_pixels.sum()==cm.sum()
    fig,axes=plt.subplots(1,2,figsize=(7.1,3.15),gridspec_kw={"width_ratios":[1.15,1]})
    ax,bx=axes
    mat=cm/cm.sum(axis=1)[:,None]
    ax.imshow(mat,cmap="Blues",vmin=0,vmax=1)
    names=["Other","Corn","Soybean","Wheat"]
    ax.set(xticks=range(4),xticklabels=names,yticks=range(4),yticklabels=names,
           xlabel="Predicted class",ylabel="CDL reference class",title="a  Test confusion matrix")
    ax.tick_params(labelsize=8)
    for r in range(4):
        for c in range(4):
            ax.text(c,r,f"{100*mat[r,c]:.1f}",ha="center",va="center",fontsize=9,color="white" if mat[r,c]>.6 else "#222222")
    y=np.arange(3)
    bars=bx.barh(y,reg.overall_accuracy*100,color="#0072b2",height=.5)
    bx.set(yticks=y,yticklabels=["Monoculture","Regular","Irregular"],xlim=(0,112),xlabel="Accuracy (%)",title="b  Historical regime")
    bx.set_xticks([0,25,50,75,100]);bx.invert_yaxis()
    bx.bar_label(bars,labels=[f"{x:.1f}%" for x in reg.overall_accuracy*100],padding=3,fontsize=9)
    bx.grid(axis="x",alpha=.18); bx.set_axisbelow(True)
    fig.tight_layout(w_pad=1.3)
    save(fig,"prediction")

if __name__=="__main__":
    workflow();phenology();rotation();moisture();prediction()
    manifest={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(SOURCES)}
    (OUT/"source_manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
    print(f"Wrote 5 figures from {len(SOURCES)} checked source files to {OUT}")
