import { R as G, e as z } from "./sidepanel-DjwwbR2c.js";
import {
	r as $e,
	c as ae,
	k as Be,
	j as De,
	d as F,
	b as fe,
	h as H,
	g as j,
	s as K,
	a as k,
	e as N,
	p as Ne,
	t as pe,
	m as q,
	l as Re,
	i as Se,
	o as ue,
	f as Ve,
	n as we,
	q as Z,
} from "./utils-D71RtZIR.js";

let Q;
function ke() {
	const i = H(),
		e = j();
	return {
		smoothScroll:
			e.documentElement &&
			e.documentElement.style &&
			"scrollBehavior" in e.documentElement.style,
		touch: !!(
			"ontouchstart" in i ||
			(i.DocumentTouch && e instanceof i.DocumentTouch)
		),
	};
}
function Te() {
	return Q || (Q = ke()), Q;
}
let ee;
function Fe(i) {
	const { userAgent: e } = i === void 0 ? {} : i;
	const t = Te(),
		s = H(),
		n = s.navigator.platform,
		r = e || s.navigator.userAgent,
		a = { ios: !1, android: !1 },
		o = s.screen.width,
		l = s.screen.height,
		d = r.match(/(Android);?[\s/]+([\d.]+)?/);
	let c = r.match(/(iPad).*OS\s([\d_]+)/);
	const f = r.match(/(iPod)(.*OS\s([\d_]+))?/),
		u = !c && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
		p = n === "Win32";
	let h = n === "MacIntel";
	const v = [
		"1024x1366",
		"1366x1024",
		"834x1194",
		"1194x834",
		"834x1112",
		"1112x834",
		"768x1024",
		"1024x768",
		"820x1180",
		"1180x820",
		"810x1080",
		"1080x810",
	];
	return (
		!c &&
			h &&
			t.touch &&
			v.indexOf(`${o}x${l}`) >= 0 &&
			((c = r.match(/(Version)\/([\d.]+)/)),
			c || (c = [0, 1, "13_0_0"]),
			(h = !1)),
		d && !p && ((a.os = "android"), (a.android = !0)),
		(c || u || f) && ((a.os = "ios"), (a.ios = !0)),
		a
	);
}
function be(i) {
	return i === void 0 && (i = {}), ee || (ee = Fe(i)), ee;
}
let te;
function He() {
	const i = H(),
		e = be();
	let t = !1;
	function s() {
		const o = i.navigator.userAgent.toLowerCase();
		return (
			o.indexOf("safari") >= 0 &&
			o.indexOf("chrome") < 0 &&
			o.indexOf("android") < 0
		);
	}
	if (s()) {
		const o = String(i.navigator.userAgent);
		if (o.includes("Version/")) {
			const [l, d] = o
				.split("Version/")[1]
				.split(" ")[0]
				.split(".")
				.map((c) => Number(c));
			t = l < 16 || (l === 16 && d < 2);
		}
	}
	const n = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
			i.navigator.userAgent,
		),
		r = s(),
		a = r || (n && e.ios);
	return {
		isSafari: t || r,
		needPerspectiveFix: t,
		need3dFix: a,
		isWebView: n,
	};
}
function xe() {
	return te || (te = He()), te;
}
function We(i) {
	const { swiper: e, on: t, emit: s } = i;
	const n = H();
	let r = null,
		a = null;
	const o = () => {
			!e ||
				e.destroyed ||
				!e.initialized ||
				(s("beforeResize"), s("resize"));
		},
		l = () => {
			!e ||
				e.destroyed ||
				!e.initialized ||
				((r = new ResizeObserver((f) => {
					a = n.requestAnimationFrame(() => {
						const { width: u, height: p } = e;
						let h = u,
							v = p;
						f.forEach((P) => {
							const {
								contentBoxSize: m,
								contentRect: S,
								target: g,
							} = P;
							(g && g !== e.el) ||
								((h = S ? S.width : (m[0] || m).inlineSize),
								(v = S ? S.height : (m[0] || m).blockSize));
						}),
							(h !== u || v !== p) && o();
					});
				})),
				r.observe(e.el));
		},
		d = () => {
			a && n.cancelAnimationFrame(a),
				r && r.unobserve && e.el && (r.unobserve(e.el), (r = null));
		},
		c = () => {
			!e || e.destroyed || !e.initialized || s("orientationchange");
		};
	t("init", () => {
		if (e.params.resizeObserver && typeof n.ResizeObserver < "u") {
			l();
			return;
		}
		n.addEventListener("resize", o),
			n.addEventListener("orientationchange", c);
	}),
		t("destroy", () => {
			d(),
				n.removeEventListener("resize", o),
				n.removeEventListener("orientationchange", c);
		});
}
function je(i) {
	const { swiper: e, extendParams: t, on: s, emit: n } = i;
	const r = [],
		a = H(),
		o = (c, f) => {
			f === void 0 && (f = {});
			const u = a.MutationObserver || a.WebkitMutationObserver,
				p = new u((h) => {
					if (e.__preventObserver__) return;
					if (h.length === 1) {
						n("observerUpdate", h[0]);
						return;
					}
					const v = () => {
						n("observerUpdate", h[0]);
					};
					a.requestAnimationFrame
						? a.requestAnimationFrame(v)
						: a.setTimeout(v, 0);
				});
			p.observe(c, {
				attributes: typeof f.attributes > "u" ? !0 : f.attributes,
				childList:
					e.isElement ||
					(typeof f.childList > "u" ? !0 : f).childList,
				characterData:
					typeof f.characterData > "u" ? !0 : f.characterData,
			}),
				r.push(p);
		},
		l = () => {
			if (e.params.observer) {
				if (e.params.observeParents) {
					const c = $e(e.hostEl);
					for (let f = 0; f < c.length; f += 1) o(c[f]);
				}
				o(e.hostEl, { childList: e.params.observeSlideChildren }),
					o(e.wrapperEl, { attributes: !1 });
			}
		},
		d = () => {
			r.forEach((c) => {
				c.disconnect();
			}),
				r.splice(0, r.length);
		};
	t({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
		s("init", l),
		s("destroy", d);
}
var Ye = {
	on(i, e, t) {
		if (!this.eventsListeners || this.destroyed || typeof e != "function")
			return this;
		const n = t ? "unshift" : "push";
		return (
			i.split(" ").forEach((r) => {
				this.eventsListeners[r] || (this.eventsListeners[r] = []),
					this.eventsListeners[r][n](e);
			}),
			this
		);
	},
	once(i, e, t) {
		const s = this;
		if (!s.eventsListeners || s.destroyed || typeof e != "function")
			return s;
		function n() {
			s.off(i, n), n.__emitterProxy && delete n.__emitterProxy;
			for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++)
				a[o] = arguments[o];
			e.apply(s, a);
		}
		return (n.__emitterProxy = e), s.on(i, n, t);
	},
	onAny(i, e) {
		if (!this.eventsListeners || this.destroyed || typeof i != "function")
			return this;
		const s = e ? "unshift" : "push";
		return (
			this.eventsAnyListeners.indexOf(i) < 0 &&
				this.eventsAnyListeners[s](i),
			this
		);
	},
	offAny(i) {
		if (!this.eventsListeners || this.destroyed || !this.eventsAnyListeners)
			return this;
		const t = this.eventsAnyListeners.indexOf(i);
		return t >= 0 && this.eventsAnyListeners.splice(t, 1), this;
	},
	off(i, e) {
		return (
			!this.eventsListeners ||
				this.destroyed ||
				!this.eventsListeners ||
				i.split(" ").forEach((s) => {
					typeof e > "u"
						? (this.eventsListeners[s] = [])
						: this.eventsListeners[s] &&
							this.eventsListeners[s].forEach((n, r) => {
								(n === e ||
									(n.__emitterProxy &&
										n.__emitterProxy === e)) &&
									this.eventsListeners[s].splice(r, 1);
							});
				}),
			this
		);
	},
	emit() {
		if (!this.eventsListeners || this.destroyed || !this.eventsListeners)
			return this;
		let e, t, s;
		for (var n = arguments.length, r = new Array(n), a = 0; a < n; a++)
			r[a] = arguments[a];
		return (
			typeof r[0] == "string" || Array.isArray(r[0])
				? ((e = r[0]), (t = r.slice(1, r.length)), (s = this))
				: ((e = r[0].events),
					(t = r[0].data),
					(s = r[0].context || this)),
			t.unshift(s),
			(Array.isArray(e) ? e : e.split(" ")).forEach((l) => {
				this.eventsAnyListeners &&
					this.eventsAnyListeners.length &&
					this.eventsAnyListeners.forEach((d) => {
						d.apply(s, [l, ...t]);
					}),
					this.eventsListeners &&
						this.eventsListeners[l] &&
						this.eventsListeners[l].forEach((d) => {
							d.apply(s, t);
						});
			}),
			this
		);
	},
};
function Xe() {
	let e, t;
	const s = this.el;
	typeof this.params.width < "u" && this.params.width !== null
		? (e = this.params.width)
		: (e = s.clientWidth),
		typeof this.params.height < "u" && this.params.height !== null
			? (t = this.params.height)
			: (t = s.clientHeight),
		!((e === 0 && this.isHorizontal()) || (t === 0 && this.isVertical())) &&
			((e =
				e -
				Number.parseInt(F(s, "padding-left") || 0, 10) -
				Number.parseInt(F(s, "padding-right") || 0, 10)),
			(t =
				t -
				Number.parseInt(F(s, "padding-top") || 0, 10) -
				Number.parseInt(F(s, "padding-bottom") || 0, 10)),
			Number.isNaN(e) && (e = 0),
			Number.isNaN(t) && (t = 0),
			Object.assign(this, {
				width: e,
				height: t,
				size: this.isHorizontal() ? e : t,
			}));
}
function qe() {
	const i = this;
	function e(w, x) {
		return Number.parseFloat(
			w.getPropertyValue(i.getDirectionLabel(x)) || 0,
		);
	}
	const t = i.params,
		{
			wrapperEl: s,
			slidesEl: n,
			size: r,
			rtlTranslate: a,
			wrongRTL: o,
		} = i,
		l = i.virtual && t.virtual.enabled,
		d = l ? i.virtual.slides.length : i.slides.length,
		c = k(n, `.${i.params.slideClass}, swiper-slide`),
		f = l ? i.virtual.slides.length : c.length;
	let u = [];
	const p = [],
		h = [];
	let v = t.slidesOffsetBefore;
	typeof v == "function" && (v = t.slidesOffsetBefore.call(i));
	let P = t.slidesOffsetAfter;
	typeof P == "function" && (P = t.slidesOffsetAfter.call(i));
	const m = i.snapGrid.length,
		S = i.slidesGrid.length;
	let g = t.spaceBetween,
		E = -v,
		T = 0,
		I = 0;
	if (typeof r > "u") return;
	typeof g == "string" && g.indexOf("%") >= 0
		? (g = (Number.parseFloat(g.replace("%", "")) / 100) * r)
		: typeof g == "string" && (g = Number.parseFloat(g)),
		(i.virtualSize = -g),
		c.forEach((w) => {
			a ? (w.style.marginLeft = "") : (w.style.marginRight = ""),
				(w.style.marginBottom = ""),
				(w.style.marginTop = "");
		}),
		t.centeredSlides &&
			t.cssMode &&
			(q(s, "--swiper-centered-offset-before", ""),
			q(s, "--swiper-centered-offset-after", ""));
	const C = t.grid && t.grid.rows > 1 && i.grid;
	C ? i.grid.initSlides(c) : i.grid && i.grid.unsetSlides();
	let y;
	const b =
		t.slidesPerView === "auto" &&
		t.breakpoints &&
		Object.keys(t.breakpoints).filter(
			(w) => typeof t.breakpoints[w].slidesPerView < "u",
		).length > 0;
	for (let w = 0; w < f; w += 1) {
		y = 0;
		let x;
		if (
			(c[w] && (x = c[w]),
			C && i.grid.updateSlide(w, x, c),
			!(c[w] && F(x, "display") === "none"))
		) {
			if (t.slidesPerView === "auto") {
				b && (c[w].style[i.getDirectionLabel("width")] = "");
				const M = getComputedStyle(x),
					A = x.style.transform,
					D = x.style.webkitTransform;
				if (
					(A && (x.style.transform = "none"),
					D && (x.style.webkitTransform = "none"),
					t.roundLengths)
				)
					y = i.isHorizontal() ? ue(x, "width") : ue(x, "height");
				else {
					const B = e(M, "width"),
						L = e(M, "padding-left"),
						_ = e(M, "padding-right"),
						V = e(M, "margin-left"),
						O = e(M, "margin-right"),
						R = M.getPropertyValue("box-sizing");
					if (R && R === "border-box") y = B + V + O;
					else {
						const { clientWidth: Ge, offsetWidth: _e } = x;
						y = B + L + _ + V + O + (_e - Ge);
					}
				}
				A && (x.style.transform = A),
					D && (x.style.webkitTransform = D),
					t.roundLengths && (y = Math.floor(y));
			} else
				(y = (r - (t.slidesPerView - 1) * g) / t.slidesPerView),
					t.roundLengths && (y = Math.floor(y)),
					c[w] &&
						(c[w].style[i.getDirectionLabel("width")] = `${y}px`);
			c[w] && (c[w].swiperSlideSize = y),
				h.push(y),
				t.centeredSlides
					? ((E = E + y / 2 + T / 2 + g),
						T === 0 && w !== 0 && (E = E - r / 2 - g),
						w === 0 && (E = E - r / 2 - g),
						Math.abs(E) < 1 / 1e3 && (E = 0),
						t.roundLengths && (E = Math.floor(E)),
						I % t.slidesPerGroup === 0 && u.push(E),
						p.push(E))
					: (t.roundLengths && (E = Math.floor(E)),
						(I - Math.min(i.params.slidesPerGroupSkip, I)) %
							i.params.slidesPerGroup ===
							0 && u.push(E),
						p.push(E),
						(E = E + y + g)),
				(i.virtualSize += y + g),
				(T = y),
				(I += 1);
		}
	}
	if (
		((i.virtualSize = Math.max(i.virtualSize, r) + P),
		a &&
			o &&
			(t.effect === "slide" || t.effect === "coverflow") &&
			(s.style.width = `${i.virtualSize + g}px`),
		t.setWrapperSize &&
			(s.style[i.getDirectionLabel("width")] = `${i.virtualSize + g}px`),
		C && i.grid.updateWrapperSize(y, u),
		!t.centeredSlides)
	) {
		const w = [];
		for (let x = 0; x < u.length; x += 1) {
			let M = u[x];
			t.roundLengths && (M = Math.floor(M)),
				u[x] <= i.virtualSize - r && w.push(M);
		}
		(u = w),
			Math.floor(i.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 &&
				u.push(i.virtualSize - r);
	}
	if (l && t.loop) {
		const w = h[0] + g;
		if (t.slidesPerGroup > 1) {
			const x = Math.ceil(
					(i.virtual.slidesBefore + i.virtual.slidesAfter) /
						t.slidesPerGroup,
				),
				M = w * t.slidesPerGroup;
			for (let A = 0; A < x; A += 1) u.push(u[u.length - 1] + M);
		}
		for (
			let x = 0;
			x < i.virtual.slidesBefore + i.virtual.slidesAfter;
			x += 1
		)
			t.slidesPerGroup === 1 && u.push(u[u.length - 1] + w),
				p.push(p[p.length - 1] + w),
				(i.virtualSize += w);
	}
	if ((u.length === 0 && (u = [0]), g !== 0)) {
		const w =
			i.isHorizontal() && a
				? "marginLeft"
				: i.getDirectionLabel("marginRight");
		c.filter((x, M) =>
			!t.cssMode || t.loop ? !0 : M !== c.length - 1,
		).forEach((x) => {
			x.style[w] = `${g}px`;
		});
	}
	if (t.centeredSlides && t.centeredSlidesBounds) {
		let w = 0;
		h.forEach((M) => {
			w += M + (g || 0);
		}),
			(w -= g);
		const x = w > r ? w - r : 0;
		u = u.map((M) => (M <= 0 ? -v : M > x ? x + P : M));
	}
	if (t.centerInsufficientSlides) {
		let w = 0;
		h.forEach((M) => {
			w += M + (g || 0);
		}),
			(w -= g);
		const x = (t.slidesOffsetBefore || 0) + (t.slidesOffsetAfter || 0);
		if (w + x < r) {
			const M = (r - w - x) / 2;
			u.forEach((A, D) => {
				u[D] = A - M;
			}),
				p.forEach((A, D) => {
					p[D] = A + M;
				});
		}
	}
	if (
		(Object.assign(i, {
			slides: c,
			snapGrid: u,
			slidesGrid: p,
			slidesSizesGrid: h,
		}),
		t.centeredSlides && t.cssMode && !t.centeredSlidesBounds)
	) {
		q(s, "--swiper-centered-offset-before", `${-u[0]}px`),
			q(
				s,
				"--swiper-centered-offset-after",
				`${i.size / 2 - h[h.length - 1] / 2}px`,
			);
		const w = -i.snapGrid[0],
			x = -i.slidesGrid[0];
		(i.snapGrid = i.snapGrid.map((M) => M + w)),
			(i.slidesGrid = i.slidesGrid.map((M) => M + x));
	}
	if (
		(f !== d && i.emit("slidesLengthChange"),
		u.length !== m &&
			(i.params.watchOverflow && i.checkOverflow(),
			i.emit("snapGridLengthChange")),
		p.length !== S && i.emit("slidesGridLengthChange"),
		t.watchSlidesProgress && i.updateSlidesOffset(),
		i.emit("slidesUpdated"),
		!l && !t.cssMode && (t.effect === "slide" || t.effect === "fade"))
	) {
		const w = `${t.containerModifierClass}backface-hidden`,
			x = i.el.classList.contains(w);
		f <= t.maxBackfaceHiddenSlides
			? x || i.el.classList.add(w)
			: x && i.el.classList.remove(w);
	}
}
function Ue(i) {
	const t = [],
		s = this.virtual && this.params.virtual.enabled;
	let n = 0,
		r;
	typeof i == "number"
		? this.setTransition(i)
		: i === !0 && this.setTransition(this.params.speed);
	const a = (o) =>
		s ? this.slides[this.getSlideIndexByData(o)] : this.slides[o];
	if (this.params.slidesPerView !== "auto" && this.params.slidesPerView > 1)
		if (this.params.centeredSlides)
			(this.visibleSlides || []).forEach((o) => {
				t.push(o);
			});
		else
			for (r = 0; r < Math.ceil(this.params.slidesPerView); r += 1) {
				const o = this.activeIndex + r;
				if (o > this.slides.length && !s) break;
				t.push(a(o));
			}
	else t.push(a(this.activeIndex));
	for (r = 0; r < t.length; r += 1)
		if (typeof t[r] < "u") {
			const o = t[r].offsetHeight;
			n = o > n ? o : n;
		}
	(n || n === 0) && (this.wrapperEl.style.height = `${n}px`);
}
function Ke() {
	const e = this.slides,
		t = this.isElement
			? this.isHorizontal()
				? this.wrapperEl.offsetLeft
				: this.wrapperEl.offsetTop
			: 0;
	for (let s = 0; s < e.length; s += 1)
		e[s].swiperSlideOffset =
			(this.isHorizontal() ? e[s].offsetLeft : e[s].offsetTop) -
			t -
			this.cssOverflowAdjustment();
}
const he = (i, e, t) => {
	e && !i.classList.contains(t)
		? i.classList.add(t)
		: !e && i.classList.contains(t) && i.classList.remove(t);
};
function Ze(i) {
	i === void 0 && (i = (this && this.translate) || 0);
	const t = this.params,
		{ slides: s, rtlTranslate: n, snapGrid: r } = this;
	if (s.length === 0) return;
	typeof s[0].swiperSlideOffset > "u" && this.updateSlidesOffset();
	let a = -i;
	n && (a = i), (this.visibleSlidesIndexes = []), (this.visibleSlides = []);
	let o = t.spaceBetween;
	typeof o == "string" && o.indexOf("%") >= 0
		? (o = (Number.parseFloat(o.replace("%", "")) / 100) * this.size)
		: typeof o == "string" && (o = Number.parseFloat(o));
	for (let l = 0; l < s.length; l += 1) {
		const d = s[l];
		let c = d.swiperSlideOffset;
		t.cssMode && t.centeredSlides && (c -= s[0].swiperSlideOffset);
		const f =
				(a + (t.centeredSlides ? this.minTranslate() : 0) - c) /
				(d.swiperSlideSize + o),
			u =
				(a - r[0] + (t.centeredSlides ? this.minTranslate() : 0) - c) /
				(d.swiperSlideSize + o),
			p = -(a - c),
			h = p + this.slidesSizesGrid[l],
			v = p >= 0 && p <= this.size - this.slidesSizesGrid[l],
			P =
				(p >= 0 && p < this.size - 1) ||
				(h > 1 && h <= this.size) ||
				(p <= 0 && h >= this.size);
		P && (this.visibleSlides.push(d), this.visibleSlidesIndexes.push(l)),
			he(d, P, t.slideVisibleClass),
			he(d, v, t.slideFullyVisibleClass),
			(d.progress = n ? -f : f),
			(d.originalProgress = n ? -u : u);
	}
}
function Je(i) {
	if (typeof i > "u") {
		const c = this.rtlTranslate ? -1 : 1;
		i = (this && this.translate && this.translate * c) || 0;
	}
	const t = this.params,
		s = this.maxTranslate() - this.minTranslate();
	let { progress: n, isBeginning: r, isEnd: a, progressLoop: o } = this;
	const l = r,
		d = a;
	if (s === 0) (n = 0), (r = !0), (a = !0);
	else {
		n = (i - this.minTranslate()) / s;
		const c = Math.abs(i - this.minTranslate()) < 1,
			f = Math.abs(i - this.maxTranslate()) < 1;
		(r = c || n <= 0), (a = f || n >= 1), c && (n = 0), f && (n = 1);
	}
	if (t.loop) {
		const c = this.getSlideIndexByData(0),
			f = this.getSlideIndexByData(this.slides.length - 1),
			u = this.slidesGrid[c],
			p = this.slidesGrid[f],
			h = this.slidesGrid[this.slidesGrid.length - 1],
			v = Math.abs(i);
		v >= u ? (o = (v - u) / h) : (o = (v + h - p) / h), o > 1 && (o -= 1);
	}
	Object.assign(this, {
		progress: n,
		progressLoop: o,
		isBeginning: r,
		isEnd: a,
	}),
		(t.watchSlidesProgress || (t.centeredSlides && t.autoHeight)) &&
			this.updateSlidesProgress(i),
		r && !l && this.emit("reachBeginning toEdge"),
		a && !d && this.emit("reachEnd toEdge"),
		((l && !r) || (d && !a)) && this.emit("fromEdge"),
		this.emit("progress", n);
}
const ie = (i, e, t) => {
	e && !i.classList.contains(t)
		? i.classList.add(t)
		: !e && i.classList.contains(t) && i.classList.remove(t);
};
function Qe() {
	const { slides: e, params: t, slidesEl: s, activeIndex: n } = this,
		r = this.virtual && t.virtual.enabled,
		a = this.grid && t.grid && t.grid.rows > 1,
		o = (f) => k(s, `.${t.slideClass}${f}, swiper-slide${f}`)[0];
	let l, d, c;
	if (r)
		if (t.loop) {
			let f = n - this.virtual.slidesBefore;
			f < 0 && (f = this.virtual.slides.length + f),
				f >= this.virtual.slides.length &&
					(f -= this.virtual.slides.length),
				(l = o(`[data-swiper-slide-index="${f}"]`));
		} else l = o(`[data-swiper-slide-index="${n}"]`);
	else
		a
			? ((l = e.find((f) => f.column === n)),
				(c = e.find((f) => f.column === n + 1)),
				(d = e.find((f) => f.column === n - 1)))
			: (l = e[n]);
	l &&
		(a ||
			((c = Be(l, `.${t.slideClass}, swiper-slide`)[0]),
			t.loop && !c && (c = e[0]),
			(d = Re(l, `.${t.slideClass}, swiper-slide`)[0]),
			t.loop && !d === 0 && (d = e[e.length - 1]))),
		e.forEach((f) => {
			ie(f, f === l, t.slideActiveClass),
				ie(f, f === c, t.slideNextClass),
				ie(f, f === d, t.slidePrevClass);
		}),
		this.emitSlidesClasses();
}
const U = (i, e) => {
		if (!i || i.destroyed || !i.params) return;
		const t = () =>
				i.isElement ? "swiper-slide" : `.${i.params.slideClass}`,
			s = e.closest(t());
		if (s) {
			let n = s.querySelector(`.${i.params.lazyPreloaderClass}`);
			!n &&
				i.isElement &&
				(s.shadowRoot
					? (n = s.shadowRoot.querySelector(
							`.${i.params.lazyPreloaderClass}`,
						))
					: requestAnimationFrame(() => {
							s.shadowRoot &&
								((n = s.shadowRoot.querySelector(
									`.${i.params.lazyPreloaderClass}`,
								)),
								n && n.remove());
						})),
				n && n.remove();
		}
	},
	se = (i, e) => {
		if (!i.slides[e]) return;
		const t = i.slides[e].querySelector('[loading="lazy"]');
		t && t.removeAttribute("loading");
	},
	le = (i) => {
		if (!i || i.destroyed || !i.params) return;
		let e = i.params.lazyPreloadPrevNext;
		const t = i.slides.length;
		if (!t || !e || e < 0) return;
		e = Math.min(e, t);
		const s =
				i.params.slidesPerView === "auto"
					? i.slidesPerViewDynamic()
					: Math.ceil(i.params.slidesPerView),
			n = i.activeIndex;
		if (i.params.grid && i.params.grid.rows > 1) {
			const a = n,
				o = [a - e];
			o.push(...Array.from({ length: e }).map((l, d) => a + s + d)),
				i.slides.forEach((l, d) => {
					o.includes(l.column) && se(i, d);
				});
			return;
		}
		const r = n + s - 1;
		if (i.params.rewind || i.params.loop)
			for (let a = n - e; a <= r + e; a += 1) {
				const o = ((a % t) + t) % t;
				(o < n || o > r) && se(i, o);
			}
		else
			for (
				let a = Math.max(n - e, 0);
				a <= Math.min(r + e, t - 1);
				a += 1
			)
				a !== n && (a > r || a < n) && se(i, a);
	};
function et(i) {
	const { slidesGrid: e, params: t } = i,
		s = i.rtlTranslate ? i.translate : -i.translate;
	let n;
	for (let r = 0; r < e.length; r += 1)
		typeof e[r + 1] < "u"
			? s >= e[r] && s < e[r + 1] - (e[r + 1] - e[r]) / 2
				? (n = r)
				: s >= e[r] && s < e[r + 1] && (n = r + 1)
			: s >= e[r] && (n = r);
	return t.normalizeSlideIndex && (n < 0 || typeof n > "u") && (n = 0), n;
}
function tt(i) {
	const t = this.rtlTranslate ? this.translate : -this.translate,
		{
			snapGrid: s,
			params: n,
			activeIndex: r,
			realIndex: a,
			snapIndex: o,
		} = this;
	let l = i,
		d;
	const c = (p) => {
		let h = p - this.virtual.slidesBefore;
		return (
			h < 0 && (h = this.virtual.slides.length + h),
			h >= this.virtual.slides.length &&
				(h -= this.virtual.slides.length),
			h
		);
	};
	if ((typeof l > "u" && (l = et(this)), s.indexOf(t) >= 0)) d = s.indexOf(t);
	else {
		const p = Math.min(n.slidesPerGroupSkip, l);
		d = p + Math.floor((l - p) / n.slidesPerGroup);
	}
	if ((d >= s.length && (d = s.length - 1), l === r && !this.params.loop)) {
		d !== o && ((this.snapIndex = d), this.emit("snapIndexChange"));
		return;
	}
	if (
		l === r &&
		this.params.loop &&
		this.virtual &&
		this.params.virtual.enabled
	) {
		this.realIndex = c(l);
		return;
	}
	const f = this.grid && n.grid && n.grid.rows > 1;
	let u;
	if (this.virtual && n.virtual.enabled && n.loop) u = c(l);
	else if (f) {
		const p = this.slides.find((v) => v.column === l);
		let h = Number.parseInt(p.getAttribute("data-swiper-slide-index"), 10);
		Number.isNaN(h) && (h = Math.max(this.slides.indexOf(p), 0)),
			(u = Math.floor(h / n.grid.rows));
	} else if (this.slides[l]) {
		const p = this.slides[l].getAttribute("data-swiper-slide-index");
		p ? (u = Number.parseInt(p, 10)) : (u = l);
	} else u = l;
	Object.assign(this, {
		previousSnapIndex: o,
		snapIndex: d,
		previousRealIndex: a,
		realIndex: u,
		previousIndex: r,
		activeIndex: l,
	}),
		this.initialized && le(this),
		this.emit("activeIndexChange"),
		this.emit("snapIndexChange"),
		(this.initialized || this.params.runCallbacksOnInit) &&
			(a !== u && this.emit("realIndexChange"), this.emit("slideChange"));
}
function it(i, e) {
	const s = this.params;
	let n = i.closest(`.${s.slideClass}, swiper-slide`);
	!n &&
		this.isElement &&
		e &&
		e.length > 1 &&
		e.includes(i) &&
		[...e.slice(e.indexOf(i) + 1, e.length)].forEach((o) => {
			!n &&
				o.matches &&
				o.matches(`.${s.slideClass}, swiper-slide`) &&
				(n = o);
		});
	let r = !1,
		a;
	if (n) {
		for (let o = 0; o < this.slides.length; o += 1)
			if (this.slides[o] === n) {
				(r = !0), (a = o);
				break;
			}
	}
	if (n && r)
		(this.clickedSlide = n),
			this.virtual && this.params.virtual.enabled
				? (this.clickedIndex = Number.parseInt(
						n.getAttribute("data-swiper-slide-index"),
						10,
					))
				: (this.clickedIndex = a);
	else {
		(this.clickedSlide = void 0), (this.clickedIndex = void 0);
		return;
	}
	s.slideToClickedSlide &&
		this.clickedIndex !== void 0 &&
		this.clickedIndex !== this.activeIndex &&
		this.slideToClickedSlide();
}
var st = {
	updateSize: Xe,
	updateSlides: qe,
	updateAutoHeight: Ue,
	updateSlidesOffset: Ke,
	updateSlidesProgress: Ze,
	updateProgress: Je,
	updateSlidesClasses: Qe,
	updateActiveIndex: tt,
	updateClickedSlide: it,
};
function rt(i) {
	i === void 0 && (i = this.isHorizontal() ? "x" : "y");
	const { params: t, rtlTranslate: s, translate: n, wrapperEl: r } = this;
	if (t.virtualTranslate) return s ? -n : n;
	if (t.cssMode) return n;
	let a = De(r, i);
	return (a += this.cssOverflowAdjustment()), s && (a = -a), a || 0;
}
function nt(i, e) {
	const { rtlTranslate: s, params: n, wrapperEl: r, progress: a } = this;
	let o = 0,
		l = 0;
	const d = 0;
	this.isHorizontal() ? (o = s ? -i : i) : (l = i),
		n.roundLengths && ((o = Math.floor(o)), (l = Math.floor(l))),
		(this.previousTranslate = this.translate),
		(this.translate = this.isHorizontal() ? o : l),
		n.cssMode
			? (r[this.isHorizontal() ? "scrollLeft" : "scrollTop"] =
					this.isHorizontal() ? -o : -l)
			: n.virtualTranslate ||
				(this.isHorizontal()
					? (o -= this.cssOverflowAdjustment())
					: (l -= this.cssOverflowAdjustment()),
				(r.style.transform = `translate3d(${o}px, ${l}px, ${d}px)`));
	let c;
	const f = this.maxTranslate() - this.minTranslate();
	f === 0 ? (c = 0) : (c = (i - this.minTranslate()) / f),
		c !== a && this.updateProgress(i),
		this.emit("setTranslate", this.translate, e);
}
function at() {
	return -this.snapGrid[0];
}
function lt() {
	return -this.snapGrid[this.snapGrid.length - 1];
}
function ot(i, e, t, s, n) {
	i === void 0 && (i = 0),
		e === void 0 && (e = this.params.speed),
		t === void 0 && (t = !0),
		s === void 0 && (s = !0);
	const r = this,
		{ params: a, wrapperEl: o } = r;
	if (r.animating && a.preventInteractionOnTransition) return !1;
	const l = r.minTranslate(),
		d = r.maxTranslate();
	let c;
	if (
		(s && i > l ? (c = l) : s && i < d ? (c = d) : (c = i),
		r.updateProgress(c),
		a.cssMode)
	) {
		const f = r.isHorizontal();
		if (e === 0) o[f ? "scrollLeft" : "scrollTop"] = -c;
		else {
			if (!r.support.smoothScroll)
				return (
					Se({
						swiper: r,
						targetPosition: -c,
						side: f ? "left" : "top",
					}),
					!0
				);
			o.scrollTo({ [f ? "left" : "top"]: -c, behavior: "smooth" });
		}
		return !0;
	}
	return (
		e === 0
			? (r.setTransition(0),
				r.setTranslate(c),
				t &&
					(r.emit("beforeTransitionStart", e, n),
					r.emit("transitionEnd")))
			: (r.setTransition(e),
				r.setTranslate(c),
				t &&
					(r.emit("beforeTransitionStart", e, n),
					r.emit("transitionStart")),
				r.animating ||
					((r.animating = !0),
					r.onTranslateToWrapperTransitionEnd ||
						(r.onTranslateToWrapperTransitionEnd = function (u) {
							!r ||
								r.destroyed ||
								(u.target === this &&
									(r.wrapperEl.removeEventListener(
										"transitionend",
										r.onTranslateToWrapperTransitionEnd,
									),
									(r.onTranslateToWrapperTransitionEnd =
										null),
									delete r.onTranslateToWrapperTransitionEnd,
									(r.animating = !1),
									t && r.emit("transitionEnd")));
						}),
					r.wrapperEl.addEventListener(
						"transitionend",
						r.onTranslateToWrapperTransitionEnd,
					))),
		!0
	);
}
var dt = {
	getTranslate: rt,
	setTranslate: nt,
	minTranslate: at,
	maxTranslate: lt,
	translateTo: ot,
};
function ct(i, e) {
	this.params.cssMode ||
		((this.wrapperEl.style.transitionDuration = `${i}ms`),
		(this.wrapperEl.style.transitionDelay = i === 0 ? "0ms" : "")),
		this.emit("setTransition", i, e);
}
function Ee(i) {
	const { swiper: e, runCallbacks: t, direction: s, step: n } = i;
	const { activeIndex: r, previousIndex: a } = e;
	let o = s;
	o || (r > a ? (o = "next") : r < a ? (o = "prev") : (o = "reset")),
		e.emit(`transition${n}`),
		t && o === "reset"
			? e.emit(`slideResetTransition${n}`)
			: t &&
				r !== a &&
				(e.emit(`slideChangeTransition${n}`),
				o === "next"
					? e.emit(`slideNextTransition${n}`)
					: e.emit(`slidePrevTransition${n}`));
}
function ft(i, e) {
	i === void 0 && (i = !0);
	const { params: s } = this;
	s.cssMode ||
		(s.autoHeight && this.updateAutoHeight(),
		Ee({ swiper: this, runCallbacks: i, direction: e, step: "Start" }));
}
function ut(i, e) {
	i === void 0 && (i = !0);
	const { params: s } = this;
	(this.animating = !1),
		!s.cssMode &&
			(this.setTransition(0),
			Ee({ swiper: this, runCallbacks: i, direction: e, step: "End" }));
}
var pt = { setTransition: ct, transitionStart: ft, transitionEnd: ut };
function ht(i, e, t, s, n) {
	i === void 0 && (i = 0),
		t === void 0 && (t = !0),
		typeof i == "string" && (i = Number.parseInt(i, 10));
	const r = this;
	let a = i;
	a < 0 && (a = 0);
	const {
		params: o,
		snapGrid: l,
		slidesGrid: d,
		previousIndex: c,
		activeIndex: f,
		rtlTranslate: u,
		wrapperEl: p,
		enabled: h,
	} = r;
	if (
		(!h && !s && !n) ||
		r.destroyed ||
		(r.animating && o.preventInteractionOnTransition)
	)
		return !1;
	typeof e > "u" && (e = r.params.speed);
	const v = Math.min(r.params.slidesPerGroupSkip, a);
	let P = v + Math.floor((a - v) / r.params.slidesPerGroup);
	P >= l.length && (P = l.length - 1);
	const m = -l[P];
	if (o.normalizeSlideIndex)
		for (let C = 0; C < d.length; C += 1) {
			const y = -Math.floor(m * 100),
				b = Math.floor(d[C] * 100),
				w = Math.floor(d[C + 1] * 100);
			typeof d[C + 1] < "u"
				? y >= b && y < w - (w - b) / 2
					? (a = C)
					: y >= b && y < w && (a = C + 1)
				: y >= b && (a = C);
		}
	if (
		r.initialized &&
		a !== f &&
		((!r.allowSlideNext &&
			(u
				? m > r.translate && m > r.minTranslate()
				: m < r.translate && m < r.minTranslate())) ||
			(!r.allowSlidePrev &&
				m > r.translate &&
				m > r.maxTranslate() &&
				(f || 0) !== a))
	)
		return !1;
	a !== (c || 0) && t && r.emit("beforeSlideChangeStart"),
		r.updateProgress(m);
	let S;
	a > f ? (S = "next") : a < f ? (S = "prev") : (S = "reset");
	const g = r.virtual && r.params.virtual.enabled;
	if (!(g && n) && ((u && -m === r.translate) || (!u && m === r.translate)))
		return (
			r.updateActiveIndex(a),
			o.autoHeight && r.updateAutoHeight(),
			r.updateSlidesClasses(),
			o.effect !== "slide" && r.setTranslate(m),
			S !== "reset" && (r.transitionStart(t, S), r.transitionEnd(t, S)),
			!1
		);
	if (o.cssMode) {
		const C = r.isHorizontal(),
			y = u ? m : -m;
		if (e === 0)
			g &&
				((r.wrapperEl.style.scrollSnapType = "none"),
				(r._immediateVirtual = !0)),
				g && !r._cssModeVirtualInitialSet && r.params.initialSlide > 0
					? ((r._cssModeVirtualInitialSet = !0),
						requestAnimationFrame(() => {
							p[C ? "scrollLeft" : "scrollTop"] = y;
						}))
					: (p[C ? "scrollLeft" : "scrollTop"] = y),
				g &&
					requestAnimationFrame(() => {
						(r.wrapperEl.style.scrollSnapType = ""),
							(r._immediateVirtual = !1);
					});
		else {
			if (!r.support.smoothScroll)
				return (
					Se({
						swiper: r,
						targetPosition: y,
						side: C ? "left" : "top",
					}),
					!0
				);
			p.scrollTo({ [C ? "left" : "top"]: y, behavior: "smooth" });
		}
		return !0;
	}
	const I = xe().isSafari;
	return (
		g && !n && I && r.isElement && r.virtual.update(!1, !1, a),
		r.setTransition(e),
		r.setTranslate(m),
		r.updateActiveIndex(a),
		r.updateSlidesClasses(),
		r.emit("beforeTransitionStart", e, s),
		r.transitionStart(t, S),
		e === 0
			? r.transitionEnd(t, S)
			: r.animating ||
				((r.animating = !0),
				r.onSlideToWrapperTransitionEnd ||
					(r.onSlideToWrapperTransitionEnd = function (y) {
						!r ||
							r.destroyed ||
							(y.target === this &&
								(r.wrapperEl.removeEventListener(
									"transitionend",
									r.onSlideToWrapperTransitionEnd,
								),
								(r.onSlideToWrapperTransitionEnd = null),
								delete r.onSlideToWrapperTransitionEnd,
								r.transitionEnd(t, S)));
					}),
				r.wrapperEl.addEventListener(
					"transitionend",
					r.onSlideToWrapperTransitionEnd,
				)),
		!0
	);
}
function mt(i, e, t, s) {
	i === void 0 && (i = 0),
		t === void 0 && (t = !0),
		typeof i == "string" && (i = Number.parseInt(i, 10));
	if (this.destroyed) return;
	typeof e > "u" && (e = this.params.speed);
	const r = this.grid && this.params.grid && this.params.grid.rows > 1;
	let a = i;
	if (this.params.loop)
		if (this.virtual && this.params.virtual.enabled)
			a = a + this.virtual.slidesBefore;
		else {
			let o;
			if (r) {
				const u = a * this.params.grid.rows;
				o = this.slides.find(
					(p) => p.getAttribute("data-swiper-slide-index") * 1 === u,
				).column;
			} else o = this.getSlideIndexByData(a);
			const l = r
					? Math.ceil(this.slides.length / this.params.grid.rows)
					: this.slides.length,
				{ centeredSlides: d } = this.params;
			let c = this.params.slidesPerView;
			c === "auto"
				? (c = this.slidesPerViewDynamic())
				: ((c = Math.ceil(
						Number.parseFloat(this.params.slidesPerView, 10),
					)),
					d && c % 2 === 0 && (c = c + 1));
			let f = l - o < c;
			if (
				(d && (f = f || o < Math.ceil(c / 2)),
				s &&
					d &&
					this.params.slidesPerView !== "auto" &&
					!r &&
					(f = !1),
				f)
			) {
				const u = d
					? o < this.activeIndex
						? "prev"
						: "next"
					: o - this.activeIndex - 1 < this.params.slidesPerView
						? "next"
						: "prev";
				this.loopFix({
					direction: u,
					slideTo: !0,
					activeSlideIndex: u === "next" ? o + 1 : o - l + 1,
					slideRealIndex: u === "next" ? this.realIndex : void 0,
				});
			}
			if (r) {
				const u = a * this.params.grid.rows;
				a = this.slides.find(
					(p) => p.getAttribute("data-swiper-slide-index") * 1 === u,
				).column;
			} else a = this.getSlideIndexByData(a);
		}
	return (
		requestAnimationFrame(() => {
			this.slideTo(a, e, t, s);
		}),
		this
	);
}
function gt(i, e, t) {
	e === void 0 && (e = !0);
	const { enabled: n, params: r, animating: a } = this;
	if (!n || this.destroyed) return this;
	typeof i > "u" && (i = this.params.speed);
	let o = r.slidesPerGroup;
	r.slidesPerView === "auto" &&
		r.slidesPerGroup === 1 &&
		r.slidesPerGroupAuto &&
		(o = Math.max(this.slidesPerViewDynamic("current", !0), 1));
	const l = this.activeIndex < r.slidesPerGroupSkip ? 1 : o,
		d = this.virtual && r.virtual.enabled;
	if (r.loop) {
		if (a && !d && r.loopPreventsSliding) return !1;
		if (
			(this.loopFix({ direction: "next" }),
			(this._clientLeft = this.wrapperEl.clientLeft),
			this.activeIndex === this.slides.length - 1 && r.cssMode)
		)
			return (
				requestAnimationFrame(() => {
					this.slideTo(this.activeIndex + l, i, e, t);
				}),
				!0
			);
	}
	return r.rewind && this.isEnd
		? this.slideTo(0, i, e, t)
		: this.slideTo(this.activeIndex + l, i, e, t);
}
function vt(i, e, t) {
	e === void 0 && (e = !0);
	const {
		params: n,
		snapGrid: r,
		slidesGrid: a,
		rtlTranslate: o,
		enabled: l,
		animating: d,
	} = this;
	if (!l || this.destroyed) return this;
	typeof i > "u" && (i = this.params.speed);
	const c = this.virtual && n.virtual.enabled;
	if (n.loop) {
		if (d && !c && n.loopPreventsSliding) return !1;
		this.loopFix({ direction: "prev" }),
			(this._clientLeft = this.wrapperEl.clientLeft);
	}
	const f = o ? this.translate : -this.translate;
	function u(S) {
		return S < 0 ? -Math.floor(Math.abs(S)) : Math.floor(S);
	}
	const p = u(f),
		h = r.map((S) => u(S)),
		v = n.freeMode && n.freeMode.enabled;
	let P = r[h.indexOf(p) - 1];
	if (typeof P > "u" && (n.cssMode || v)) {
		let S;
		r.forEach((g, E) => {
			p >= g && (S = E);
		}),
			typeof S < "u" && (P = v ? r[S] : r[S > 0 ? S - 1 : S]);
	}
	let m = 0;
	if (
		(typeof P < "u" &&
			((m = a.indexOf(P)),
			m < 0 && (m = this.activeIndex - 1),
			n.slidesPerView === "auto" &&
				n.slidesPerGroup === 1 &&
				n.slidesPerGroupAuto &&
				((m = m - this.slidesPerViewDynamic("previous", !0) + 1),
				(m = Math.max(m, 0)))),
		n.rewind && this.isBeginning)
	) {
		const S =
			this.params.virtual && this.params.virtual.enabled && this.virtual
				? this.virtual.slides.length - 1
				: this.slides.length - 1;
		return this.slideTo(S, i, e, t);
	}
	if (n.loop && this.activeIndex === 0 && n.cssMode)
		return (
			requestAnimationFrame(() => {
				this.slideTo(m, i, e, t);
			}),
			!0
		);
	return this.slideTo(m, i, e, t);
}
function wt(i, e, t) {
	e === void 0 && (e = !0);
	if (!this.destroyed)
		return (
			typeof i > "u" && (i = this.params.speed),
			this.slideTo(this.activeIndex, i, e, t)
		);
}
function St(i, e, t, s) {
	e === void 0 && (e = !0), s === void 0 && (s = 0.5);
	if (this.destroyed) return;
	typeof i > "u" && (i = this.params.speed);
	let r = this.activeIndex;
	const a = Math.min(this.params.slidesPerGroupSkip, r),
		o = a + Math.floor((r - a) / this.params.slidesPerGroup),
		l = this.rtlTranslate ? this.translate : -this.translate;
	if (l >= this.snapGrid[o]) {
		const d = this.snapGrid[o],
			c = this.snapGrid[o + 1];
		l - d > (c - d) * s && (r += this.params.slidesPerGroup);
	} else {
		const d = this.snapGrid[o - 1],
			c = this.snapGrid[o];
		l - d <= (c - d) * s && (r -= this.params.slidesPerGroup);
	}
	return (
		(r = Math.max(r, 0)),
		(r = Math.min(r, this.slidesGrid.length - 1)),
		this.slideTo(r, i, e, t)
	);
}
function Tt() {
	if (this.destroyed) return;
	const { params: e, slidesEl: t } = this,
		s =
			e.slidesPerView === "auto"
				? this.slidesPerViewDynamic()
				: e.slidesPerView;
	let n = this.getSlideIndexWhenGrid(this.clickedIndex),
		r;
	const a = this.isElement ? "swiper-slide" : `.${e.slideClass}`,
		o = this.grid && this.params.grid && this.params.grid.rows > 1;
	if (e.loop) {
		if (this.animating) return;
		(r = Number.parseInt(
			this.clickedSlide.getAttribute("data-swiper-slide-index"),
			10,
		)),
			e.centeredSlides
				? this.slideToLoop(r)
				: n >
						(o
							? (this.slides.length - s) / 2 -
								(this.params.grid.rows - 1)
							: this.slides.length - s)
					? (this.loopFix(),
						(n = this.getSlideIndex(
							k(t, `${a}[data-swiper-slide-index="${r}"]`)[0],
						)),
						we(() => {
							this.slideTo(n);
						}))
					: this.slideTo(n);
	} else this.slideTo(n);
}
var bt = {
	slideTo: ht,
	slideToLoop: mt,
	slideNext: gt,
	slidePrev: vt,
	slideReset: wt,
	slideToClosest: St,
	slideToClickedSlide: Tt,
};
function xt(i, e) {
	const { params: s, slidesEl: n } = this;
	if (!s.loop || (this.virtual && this.params.virtual.enabled)) return;
	const r = () => {
			k(n, `.${s.slideClass}, swiper-slide`).forEach((p, h) => {
				p.setAttribute("data-swiper-slide-index", h);
			});
		},
		a = () => {
			const u = k(n, `.${s.slideBlankClass}`);
			u.forEach((p) => {
				p.remove();
			}),
				u.length > 0 && (this.recalcSlides(), this.updateSlides());
		},
		o = this.grid && s.grid && s.grid.rows > 1;
	s.loopAddBlankSlides && (s.slidesPerGroup > 1 || o) && a();
	const l = s.slidesPerGroup * (o ? s.grid.rows : 1),
		d = this.slides.length % l !== 0,
		c = o && this.slides.length % s.grid.rows !== 0,
		f = (u) => {
			for (let p = 0; p < u; p += 1) {
				const h = this.isElement
					? ae("swiper-slide", [s.slideBlankClass])
					: ae("div", [s.slideClass, s.slideBlankClass]);
				this.slidesEl.append(h);
			}
		};
	if (d) {
		if (s.loopAddBlankSlides) {
			const u = l - (this.slides.length % l);
			f(u), this.recalcSlides(), this.updateSlides();
		} else
			K(
				"Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)",
			);
		r();
	} else if (c) {
		if (s.loopAddBlankSlides) {
			const u = s.grid.rows - (this.slides.length % s.grid.rows);
			f(u), this.recalcSlides(), this.updateSlides();
		} else
			K(
				"Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)",
			);
		r();
	} else r();
	this.loopFix({
		slideRealIndex: i,
		direction: s.centeredSlides ? void 0 : "next",
		initial: e,
	});
}
function Et(i) {
	let {
		slideRealIndex: e,
		slideTo: t = !0,
		direction: s,
		setTranslate: n,
		activeSlideIndex: r,
		initial: a,
		byController: o,
		byMousewheel: l,
	} = i === void 0 ? {} : i;
	if (!this.params.loop) return;
	this.emit("beforeLoopFix");
	const {
			slides: c,
			allowSlidePrev: f,
			allowSlideNext: u,
			slidesEl: p,
			params: h,
		} = this,
		{ centeredSlides: v, initialSlide: P } = h;
	if (
		((this.allowSlidePrev = !0),
		(this.allowSlideNext = !0),
		this.virtual && h.virtual.enabled)
	) {
		t &&
			(!h.centeredSlides && this.snapIndex === 0
				? this.slideTo(this.virtual.slides.length, 0, !1, !0)
				: h.centeredSlides && this.snapIndex < h.slidesPerView
					? this.slideTo(
							this.virtual.slides.length + this.snapIndex,
							0,
							!1,
							!0,
						)
					: this.snapIndex === this.snapGrid.length - 1 &&
						this.slideTo(this.virtual.slidesBefore, 0, !1, !0)),
			(this.allowSlidePrev = f),
			(this.allowSlideNext = u),
			this.emit("loopFix");
		return;
	}
	let m = h.slidesPerView;
	m === "auto"
		? (m = this.slidesPerViewDynamic())
		: ((m = Math.ceil(Number.parseFloat(h.slidesPerView, 10))),
			v && m % 2 === 0 && (m = m + 1));
	const S = h.slidesPerGroupAuto ? m : h.slidesPerGroup;
	let g = v ? Math.max(S, Math.ceil(m / 2)) : S;
	g % S !== 0 && (g += S - (g % S)),
		(g += h.loopAdditionalSlides),
		(this.loopedSlides = g);
	const E = this.grid && h.grid && h.grid.rows > 1;
	c.length < m + g || (this.params.effect === "cards" && c.length < m + g * 2)
		? K(
				"Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters",
			)
		: E &&
			h.grid.fill === "row" &&
			K(
				"Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`",
			);
	const T = [],
		I = [],
		C = E ? Math.ceil(c.length / h.grid.rows) : c.length,
		y = a && C - P < m && !v;
	let b = y ? P : this.activeIndex;
	typeof r > "u"
		? (r = this.getSlideIndex(
				c.find((L) => L.classList.contains(h.slideActiveClass)),
			))
		: (b = r);
	const w = s === "next" || !s,
		x = s === "prev" || !s;
	let M = 0,
		A = 0;
	const B = (E ? c[r].column : r) + (v && typeof n > "u" ? -m / 2 + 0.5 : 0);
	if (B < g) {
		M = Math.max(g - B, S);
		for (let L = 0; L < g - B; L += 1) {
			const _ = L - Math.floor(L / C) * C;
			if (E) {
				const V = C - _ - 1;
				for (let O = c.length - 1; O >= 0; O -= 1)
					c[O].column === V && T.push(O);
			} else T.push(C - _ - 1);
		}
	} else if (B + m > C - g) {
		(A = Math.max(B - (C - g * 2), S)),
			y && (A = Math.max(A, m - C + P + 1));
		for (let L = 0; L < A; L += 1) {
			const _ = L - Math.floor(L / C) * C;
			E
				? c.forEach((V, O) => {
						V.column === _ && I.push(O);
					})
				: I.push(_);
		}
	}
	if (
		((this.__preventObserver__ = !0),
		requestAnimationFrame(() => {
			this.__preventObserver__ = !1;
		}),
		this.params.effect === "cards" &&
			c.length < m + g * 2 &&
			(I.includes(r) && I.splice(I.indexOf(r), 1),
			T.includes(r) && T.splice(T.indexOf(r), 1)),
		x &&
			T.forEach((L) => {
				(c[L].swiperLoopMoveDOM = !0),
					p.prepend(c[L]),
					(c[L].swiperLoopMoveDOM = !1);
			}),
		w &&
			I.forEach((L) => {
				(c[L].swiperLoopMoveDOM = !0),
					p.append(c[L]),
					(c[L].swiperLoopMoveDOM = !1);
			}),
		this.recalcSlides(),
		h.slidesPerView === "auto"
			? this.updateSlides()
			: E &&
				((T.length > 0 && x) || (I.length > 0 && w)) &&
				this.slides.forEach((L, _) => {
					this.grid.updateSlide(_, L, this.slides);
				}),
		h.watchSlidesProgress && this.updateSlidesOffset(),
		t)
	) {
		if (T.length > 0 && x) {
			if (typeof e > "u") {
				const L = this.slidesGrid[b],
					V = this.slidesGrid[b + M] - L;
				l
					? this.setTranslate(this.translate - V)
					: (this.slideTo(b + Math.ceil(M), 0, !1, !0),
						n &&
							((this.touchEventsData.startTranslate =
								this.touchEventsData.startTranslate - V),
							(this.touchEventsData.currentTranslate =
								this.touchEventsData.currentTranslate - V)));
			} else if (n) {
				const L = E ? T.length / h.grid.rows : T.length;
				this.slideTo(this.activeIndex + L, 0, !1, !0),
					(this.touchEventsData.currentTranslate = this.translate);
			}
		} else if (I.length > 0 && w)
			if (typeof e > "u") {
				const L = this.slidesGrid[b],
					V = this.slidesGrid[b - A] - L;
				l
					? this.setTranslate(this.translate - V)
					: (this.slideTo(b - A, 0, !1, !0),
						n &&
							((this.touchEventsData.startTranslate =
								this.touchEventsData.startTranslate - V),
							(this.touchEventsData.currentTranslate =
								this.touchEventsData.currentTranslate - V)));
			} else {
				const L = E ? I.length / h.grid.rows : I.length;
				this.slideTo(this.activeIndex - L, 0, !1, !0);
			}
	}
	if (
		((this.allowSlidePrev = f),
		(this.allowSlideNext = u),
		this.controller && this.controller.control && !o)
	) {
		const L = {
			slideRealIndex: e,
			direction: s,
			setTranslate: n,
			activeSlideIndex: r,
			byController: !0,
		};
		Array.isArray(this.controller.control)
			? this.controller.control.forEach((_) => {
					!_.destroyed &&
						_.params.loop &&
						_.loopFix({
							...L,
							slideTo:
								_.params.slidesPerView === h.slidesPerView
									? t
									: !1,
						});
				})
			: this.controller.control instanceof this.constructor &&
				this.controller.control.params.loop &&
				this.controller.control.loopFix({
					...L,
					slideTo:
						this.controller.control.params.slidesPerView ===
						h.slidesPerView
							? t
							: !1,
				});
	}
	this.emit("loopFix");
}
function yt() {
	const { params: e, slidesEl: t } = this;
	if (!e.loop || !t || (this.virtual && this.params.virtual.enabled)) return;
	this.recalcSlides();
	const s = [];
	this.slides.forEach((n) => {
		const r =
			typeof n.swiperSlideIndex > "u"
				? n.getAttribute("data-swiper-slide-index") * 1
				: n.swiperSlideIndex;
		s[r] = n;
	}),
		this.slides.forEach((n) => {
			n.removeAttribute("data-swiper-slide-index");
		}),
		s.forEach((n) => {
			t.append(n);
		}),
		this.recalcSlides(),
		this.slideTo(this.realIndex, 0);
}
var Pt = { loopCreate: xt, loopFix: Et, loopDestroy: yt };
function Ct(i) {
	if (
		!this.params.simulateTouch ||
		(this.params.watchOverflow && this.isLocked) ||
		this.params.cssMode
	)
		return;
	const t =
		this.params.touchEventsTarget === "container"
			? this.el
			: this.wrapperEl;
	this.isElement && (this.__preventObserver__ = !0),
		(t.style.cursor = "move"),
		(t.style.cursor = i ? "grabbing" : "grab"),
		this.isElement &&
			requestAnimationFrame(() => {
				this.__preventObserver__ = !1;
			});
}
function Mt() {
	(this.params.watchOverflow && this.isLocked) ||
		this.params.cssMode ||
		(this.isElement && (this.__preventObserver__ = !0),
		(this[
			this.params.touchEventsTarget === "container" ? "el" : "wrapperEl"
		].style.cursor = ""),
		this.isElement &&
			requestAnimationFrame(() => {
				this.__preventObserver__ = !1;
			}));
}
var It = { setGrabCursor: Ct, unsetGrabCursor: Mt };
function Lt(i, e) {
	e === void 0 && (e = this);
	function t(s) {
		if (!s || s === j() || s === H()) return null;
		s.assignedSlot && (s = s.assignedSlot);
		const n = s.closest(i);
		return !n && !s.getRootNode ? null : n || t(s.getRootNode().host);
	}
	return t(e);
}
function me(i, e, t) {
	const s = H(),
		{ params: n } = i,
		r = n.edgeSwipeDetection,
		a = n.edgeSwipeThreshold;
	return r && (t <= a || t >= s.innerWidth - a)
		? r === "prevent"
			? (e.preventDefault(), !0)
			: !1
		: !0;
}
function zt(i) {
	const t = j();
	let s = i;
	s.originalEvent && (s = s.originalEvent);
	const n = this.touchEventsData;
	if (s.type === "pointerdown") {
		if (n.pointerId !== null && n.pointerId !== s.pointerId) return;
		n.pointerId = s.pointerId;
	} else
		s.type === "touchstart" &&
			s.targetTouches.length === 1 &&
			(n.touchId = s.targetTouches[0].identifier);
	if (s.type === "touchstart") {
		me(this, s, s.targetTouches[0].pageX);
		return;
	}
	const { params: r, touches: a, enabled: o } = this;
	if (
		!o ||
		(!r.simulateTouch && s.pointerType === "mouse") ||
		(this.animating && r.preventInteractionOnTransition)
	)
		return;
	!this.animating && r.cssMode && r.loop && this.loopFix();
	let l = s.target;
	if (
		(r.touchEventsTarget === "wrapper" && !Ne(l, this.wrapperEl)) ||
		("which" in s && s.which === 3) ||
		("button" in s && s.button > 0) ||
		(n.isTouched && n.isMoved)
	)
		return;
	const d = !!r.noSwipingClass && r.noSwipingClass !== "",
		c = s.composedPath ? s.composedPath() : s.path;
	d && s.target && s.target.shadowRoot && c && (l = c[0]);
	const f = r.noSwipingSelector
			? r.noSwipingSelector
			: `.${r.noSwipingClass}`,
		u = !!(s.target && s.target.shadowRoot);
	if (r.noSwiping && (u ? Lt(f, l) : l.closest(f))) {
		this.allowClick = !0;
		return;
	}
	if (r.swipeHandler && !l.closest(r.swipeHandler)) return;
	(a.currentX = s.pageX), (a.currentY = s.pageY);
	const p = a.currentX,
		h = a.currentY;
	if (!me(this, s, p)) return;
	Object.assign(n, {
		isTouched: !0,
		isMoved: !1,
		allowTouchCallbacks: !0,
		isScrolling: void 0,
		startMoving: void 0,
	}),
		(a.startX = p),
		(a.startY = h),
		(n.touchStartTime = Z()),
		(this.allowClick = !0),
		this.updateSize(),
		(this.swipeDirection = void 0),
		r.threshold > 0 && (n.allowThresholdMove = !1);
	let v = !0;
	l.matches(n.focusableElements) &&
		((v = !1), l.nodeName === "SELECT" && (n.isTouched = !1)),
		t.activeElement &&
			t.activeElement.matches(n.focusableElements) &&
			t.activeElement !== l &&
			(s.pointerType === "mouse" ||
				(s.pointerType !== "mouse" &&
					!l.matches(n.focusableElements))) &&
			t.activeElement.blur();
	const P = v && this.allowTouchMove && r.touchStartPreventDefault;
	(r.touchStartForcePreventDefault || P) &&
		!l.isContentEditable &&
		s.preventDefault(),
		r.freeMode &&
			r.freeMode.enabled &&
			this.freeMode &&
			this.animating &&
			!r.cssMode &&
			this.freeMode.onTouchStart(),
		this.emit("touchStart", s);
}
function Ot(i) {
	const e = j(),
		s = this.touchEventsData,
		{ params: n, touches: r, rtlTranslate: a, enabled: o } = this;
	if (!o || (!n.simulateTouch && i.pointerType === "mouse")) return;
	let l = i;
	if (
		(l.originalEvent && (l = l.originalEvent),
		l.type === "pointermove" &&
			(s.touchId !== null || l.pointerId !== s.pointerId))
	)
		return;
	let d;
	if (l.type === "touchmove") {
		if (
			((d = [...l.changedTouches].find(
				(T) => T.identifier === s.touchId,
			)),
			!d || d.identifier !== s.touchId)
		)
			return;
	} else d = l;
	if (!s.isTouched) {
		s.startMoving && s.isScrolling && this.emit("touchMoveOpposite", l);
		return;
	}
	const c = d.pageX,
		f = d.pageY;
	if (l.preventedByNestedSwiper) {
		(r.startX = c), (r.startY = f);
		return;
	}
	if (!this.allowTouchMove) {
		l.target.matches(s.focusableElements) || (this.allowClick = !1),
			s.isTouched &&
				(Object.assign(r, {
					startX: c,
					startY: f,
					currentX: c,
					currentY: f,
				}),
				(s.touchStartTime = Z()));
		return;
	}
	if (n.touchReleaseOnEdges && !n.loop)
		if (this.isVertical()) {
			if (
				(f < r.startY && this.translate <= this.maxTranslate()) ||
				(f > r.startY && this.translate >= this.minTranslate())
			) {
				(s.isTouched = !1), (s.isMoved = !1);
				return;
			}
		} else {
			if (
				a &&
				((c > r.startX && -this.translate <= this.maxTranslate()) ||
					(c < r.startX && -this.translate >= this.minTranslate()))
			)
				return;
			if (
				!a &&
				((c < r.startX && this.translate <= this.maxTranslate()) ||
					(c > r.startX && this.translate >= this.minTranslate()))
			)
				return;
		}
	if (
		(e.activeElement &&
			e.activeElement.matches(s.focusableElements) &&
			e.activeElement !== l.target &&
			l.pointerType !== "mouse" &&
			e.activeElement.blur(),
		e.activeElement &&
			l.target === e.activeElement &&
			l.target.matches(s.focusableElements))
	) {
		(s.isMoved = !0), (this.allowClick = !1);
		return;
	}
	s.allowTouchCallbacks && this.emit("touchMove", l),
		(r.previousX = r.currentX),
		(r.previousY = r.currentY),
		(r.currentX = c),
		(r.currentY = f);
	const u = r.currentX - r.startX,
		p = r.currentY - r.startY;
	if (
		this.params.threshold &&
		Math.sqrt(u ** 2 + p ** 2) < this.params.threshold
	)
		return;
	if (typeof s.isScrolling > "u") {
		let T;
		(this.isHorizontal() && r.currentY === r.startY) ||
		(this.isVertical() && r.currentX === r.startX)
			? (s.isScrolling = !1)
			: u * u + p * p >= 25 &&
				((T = (Math.atan2(Math.abs(p), Math.abs(u)) * 180) / Math.PI),
				(s.isScrolling = this.isHorizontal()
					? T > n.touchAngle
					: 90 - T > n.touchAngle));
	}
	if (
		(s.isScrolling && this.emit("touchMoveOpposite", l),
		typeof s.startMoving > "u" &&
			(r.currentX !== r.startX || r.currentY !== r.startY) &&
			(s.startMoving = !0),
		s.isScrolling ||
			(l.type === "touchmove" && s.preventTouchMoveFromPointerMove))
	) {
		s.isTouched = !1;
		return;
	}
	if (!s.startMoving) return;
	(this.allowClick = !1),
		!n.cssMode && l.cancelable && l.preventDefault(),
		n.touchMoveStopPropagation && !n.nested && l.stopPropagation();
	let h = this.isHorizontal() ? u : p,
		v = this.isHorizontal()
			? r.currentX - r.previousX
			: r.currentY - r.previousY;
	n.oneWayMovement &&
		((h = Math.abs(h) * (a ? 1 : -1)), (v = Math.abs(v) * (a ? 1 : -1))),
		(r.diff = h),
		(h *= n.touchRatio),
		a && ((h = -h), (v = -v));
	const P = this.touchesDirection;
	(this.swipeDirection = h > 0 ? "prev" : "next"),
		(this.touchesDirection = v > 0 ? "prev" : "next");
	const m = this.params.loop && !n.cssMode,
		S =
			(this.touchesDirection === "next" && this.allowSlideNext) ||
			(this.touchesDirection === "prev" && this.allowSlidePrev);
	if (!s.isMoved) {
		if (
			(m && S && this.loopFix({ direction: this.swipeDirection }),
			(s.startTranslate = this.getTranslate()),
			this.setTransition(0),
			this.animating)
		) {
			const T = new window.CustomEvent("transitionend", {
				bubbles: !0,
				cancelable: !0,
				detail: { bySwiperTouchMove: !0 },
			});
			this.wrapperEl.dispatchEvent(T);
		}
		(s.allowMomentumBounce = !1),
			n.grabCursor &&
				(this.allowSlideNext === !0 || this.allowSlidePrev === !0) &&
				this.setGrabCursor(!0),
			this.emit("sliderFirstMove", l);
	}
	if (
		(new Date().getTime(),
		n._loopSwapReset !== !1 &&
			s.isMoved &&
			s.allowThresholdMove &&
			P !== this.touchesDirection &&
			m &&
			S &&
			Math.abs(h) >= 1)
	) {
		Object.assign(r, {
			startX: c,
			startY: f,
			currentX: c,
			currentY: f,
			startTranslate: s.currentTranslate,
		}),
			(s.loopSwapReset = !0),
			(s.startTranslate = s.currentTranslate);
		return;
	}
	this.emit("sliderMove", l),
		(s.isMoved = !0),
		(s.currentTranslate = h + s.startTranslate);
	let g = !0,
		E = n.resistanceRatio;
	if (
		(n.touchReleaseOnEdges && (E = 0),
		h > 0
			? (m &&
					S &&
					s.allowThresholdMove &&
					s.currentTranslate >
						(n.centeredSlides
							? this.minTranslate() -
								this.slidesSizesGrid[this.activeIndex + 1] -
								(n.slidesPerView !== "auto" &&
								this.slides.length - n.slidesPerView >= 2
									? this.slidesSizesGrid[
											this.activeIndex + 1
										] + this.params.spaceBetween
									: 0) -
								this.params.spaceBetween
							: this.minTranslate()) &&
					this.loopFix({
						direction: "prev",
						setTranslate: !0,
						activeSlideIndex: 0,
					}),
				s.currentTranslate > this.minTranslate() &&
					((g = !1),
					n.resistance &&
						(s.currentTranslate =
							this.minTranslate() -
							1 +
							(-this.minTranslate() + s.startTranslate + h) **
								E)))
			: h < 0 &&
				(m &&
					S &&
					s.allowThresholdMove &&
					s.currentTranslate <
						(n.centeredSlides
							? this.maxTranslate() +
								this.slidesSizesGrid[
									this.slidesSizesGrid.length - 1
								] +
								this.params.spaceBetween +
								(n.slidesPerView !== "auto" &&
								this.slides.length - n.slidesPerView >= 2
									? this.slidesSizesGrid[
											this.slidesSizesGrid.length - 1
										] + this.params.spaceBetween
									: 0)
							: this.maxTranslate()) &&
					this.loopFix({
						direction: "next",
						setTranslate: !0,
						activeSlideIndex:
							this.slides.length -
							(n.slidesPerView === "auto"
								? this.slidesPerViewDynamic()
								: Math.ceil(
										Number.parseFloat(n.slidesPerView, 10),
									)),
					}),
				s.currentTranslate < this.maxTranslate() &&
					((g = !1),
					n.resistance &&
						(s.currentTranslate =
							this.maxTranslate() +
							1 -
							(this.maxTranslate() - s.startTranslate - h) **
								E))),
		g && (l.preventedByNestedSwiper = !0),
		!this.allowSlideNext &&
			this.swipeDirection === "next" &&
			s.currentTranslate < s.startTranslate &&
			(s.currentTranslate = s.startTranslate),
		!this.allowSlidePrev &&
			this.swipeDirection === "prev" &&
			s.currentTranslate > s.startTranslate &&
			(s.currentTranslate = s.startTranslate),
		!this.allowSlidePrev &&
			!this.allowSlideNext &&
			(s.currentTranslate = s.startTranslate),
		n.threshold > 0)
	)
		if (Math.abs(h) > n.threshold || s.allowThresholdMove) {
			if (!s.allowThresholdMove) {
				(s.allowThresholdMove = !0),
					(r.startX = r.currentX),
					(r.startY = r.currentY),
					(s.currentTranslate = s.startTranslate),
					(r.diff = this.isHorizontal()
						? r.currentX - r.startX
						: r.currentY - r.startY);
				return;
			}
		} else {
			s.currentTranslate = s.startTranslate;
			return;
		}
	!n.followFinger ||
		n.cssMode ||
		(((n.freeMode && n.freeMode.enabled && this.freeMode) ||
			n.watchSlidesProgress) &&
			(this.updateActiveIndex(), this.updateSlidesClasses()),
		n.freeMode &&
			n.freeMode.enabled &&
			this.freeMode &&
			this.freeMode.onTouchMove(),
		this.updateProgress(s.currentTranslate),
		this.setTranslate(s.currentTranslate));
}
function At(i) {
	const t = this.touchEventsData;
	let s = i;
	s.originalEvent && (s = s.originalEvent);
	let n;
	if (s.type === "touchend" || s.type === "touchcancel") {
		if (
			((n = [...s.changedTouches].find(
				(T) => T.identifier === t.touchId,
			)),
			!n || n.identifier !== t.touchId)
		)
			return;
	} else {
		if (t.touchId !== null || s.pointerId !== t.pointerId) return;
		n = s;
	}
	if (
		["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(
			s.type,
		) &&
		!(
			["pointercancel", "contextmenu"].includes(s.type) &&
			(this.browser.isSafari || this.browser.isWebView)
		)
	)
		return;
	(t.pointerId = null), (t.touchId = null);
	const {
		params: a,
		touches: o,
		rtlTranslate: l,
		slidesGrid: d,
		enabled: c,
	} = this;
	if (!c || (!a.simulateTouch && s.pointerType === "mouse")) return;
	if (
		(t.allowTouchCallbacks && this.emit("touchEnd", s),
		(t.allowTouchCallbacks = !1),
		!t.isTouched)
	) {
		t.isMoved && a.grabCursor && this.setGrabCursor(!1),
			(t.isMoved = !1),
			(t.startMoving = !1);
		return;
	}
	a.grabCursor &&
		t.isMoved &&
		t.isTouched &&
		(this.allowSlideNext === !0 || this.allowSlidePrev === !0) &&
		this.setGrabCursor(!1);
	const f = Z(),
		u = f - t.touchStartTime;
	if (this.allowClick) {
		const T = s.path || (s.composedPath && s.composedPath());
		this.updateClickedSlide((T && T[0]) || s.target, T),
			this.emit("tap click", s),
			u < 300 &&
				f - t.lastClickTime < 300 &&
				this.emit("doubleTap doubleClick", s);
	}
	if (
		((t.lastClickTime = Z()),
		we(() => {
			this.destroyed || (this.allowClick = !0);
		}),
		!t.isTouched ||
			!t.isMoved ||
			!this.swipeDirection ||
			(o.diff === 0 && !t.loopSwapReset) ||
			(t.currentTranslate === t.startTranslate && !t.loopSwapReset))
	) {
		(t.isTouched = !1), (t.isMoved = !1), (t.startMoving = !1);
		return;
	}
	(t.isTouched = !1), (t.isMoved = !1), (t.startMoving = !1);
	let p;
	if (
		(a.followFinger
			? (p = l ? this.translate : -this.translate)
			: (p = -t.currentTranslate),
		a.cssMode)
	)
		return;
	if (a.freeMode && a.freeMode.enabled) {
		this.freeMode.onTouchEnd({ currentPos: p });
		return;
	}
	const h = p >= -this.maxTranslate() && !this.params.loop;
	let v = 0,
		P = this.slidesSizesGrid[0];
	for (
		let T = 0;
		T < d.length;
		T += T < a.slidesPerGroupSkip ? 1 : a.slidesPerGroup
	) {
		const I = T < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
		typeof d[T + I] < "u"
			? (h || (p >= d[T] && p < d[T + I])) &&
				((v = T), (P = d[T + I] - d[T]))
			: (h || p >= d[T]) &&
				((v = T), (P = d[d.length - 1] - d[d.length - 2]));
	}
	let m = null,
		S = null;
	a.rewind &&
		(this.isBeginning
			? (S =
					a.virtual && a.virtual.enabled && this.virtual
						? this.virtual.slides.length - 1
						: this.slides.length - 1)
			: this.isEnd && (m = 0));
	const g = (p - d[v]) / P,
		E = v < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
	if (u > a.longSwipesMs) {
		if (!a.longSwipes) {
			this.slideTo(this.activeIndex);
			return;
		}
		this.swipeDirection === "next" &&
			(g >= a.longSwipesRatio
				? this.slideTo(a.rewind && this.isEnd ? m : v + E)
				: this.slideTo(v)),
			this.swipeDirection === "prev" &&
				(g > 1 - a.longSwipesRatio
					? this.slideTo(v + E)
					: S !== null && g < 0 && Math.abs(g) > a.longSwipesRatio
						? this.slideTo(S)
						: this.slideTo(v));
	} else {
		if (!a.shortSwipes) {
			this.slideTo(this.activeIndex);
			return;
		}
		this.navigation &&
		(s.target === this.navigation.nextEl ||
			s.target === this.navigation.prevEl)
			? s.target === this.navigation.nextEl
				? this.slideTo(v + E)
				: this.slideTo(v)
			: (this.swipeDirection === "next" &&
					this.slideTo(m !== null ? m : v + E),
				this.swipeDirection === "prev" &&
					this.slideTo(S !== null ? S : v));
	}
}
function ge() {
	const { params: e, el: t } = this;
	if (t && t.offsetWidth === 0) return;
	e.breakpoints && this.setBreakpoint();
	const { allowSlideNext: s, allowSlidePrev: n, snapGrid: r } = this,
		a = this.virtual && this.params.virtual.enabled;
	(this.allowSlideNext = !0),
		(this.allowSlidePrev = !0),
		this.updateSize(),
		this.updateSlides(),
		this.updateSlidesClasses();
	const o = a && e.loop;
	(e.slidesPerView === "auto" || e.slidesPerView > 1) &&
	this.isEnd &&
	!this.isBeginning &&
	!this.params.centeredSlides &&
	!o
		? this.slideTo(this.slides.length - 1, 0, !1, !0)
		: this.params.loop && !a
			? this.slideToLoop(this.realIndex, 0, !1, !0)
			: this.slideTo(this.activeIndex, 0, !1, !0),
		this.autoplay &&
			this.autoplay.running &&
			this.autoplay.paused &&
			(clearTimeout(this.autoplay.resizeTimeout),
			(this.autoplay.resizeTimeout = setTimeout(() => {
				this.autoplay &&
					this.autoplay.running &&
					this.autoplay.paused &&
					this.autoplay.resume();
			}, 500))),
		(this.allowSlidePrev = n),
		(this.allowSlideNext = s),
		this.params.watchOverflow &&
			r !== this.snapGrid &&
			this.checkOverflow();
}
function Gt(i) {
	this.enabled &&
		(this.allowClick ||
			(this.params.preventClicks && i.preventDefault(),
			this.params.preventClicksPropagation &&
				this.animating &&
				(i.stopPropagation(), i.stopImmediatePropagation())));
}
function _t() {
	const { wrapperEl: e, rtlTranslate: t, enabled: s } = this;
	if (!s) return;
	(this.previousTranslate = this.translate),
		this.isHorizontal()
			? (this.translate = -e.scrollLeft)
			: (this.translate = -e.scrollTop),
		this.translate === 0 && (this.translate = 0),
		this.updateActiveIndex(),
		this.updateSlidesClasses();
	let n;
	const r = this.maxTranslate() - this.minTranslate();
	r === 0 ? (n = 0) : (n = (this.translate - this.minTranslate()) / r),
		n !== this.progress &&
			this.updateProgress(t ? -this.translate : this.translate),
		this.emit("setTranslate", this.translate, !1);
}
function Vt(i) {
	U(this, i.target),
		!(
			this.params.cssMode ||
			(this.params.slidesPerView !== "auto" && !this.params.autoHeight)
		) && this.update();
}
function Dt() {
	this.documentTouchHandlerProceeded ||
		((this.documentTouchHandlerProceeded = !0),
		this.params.touchReleaseOnEdges &&
			(this.el.style.touchAction = "auto"));
}
const ye = (i, e) => {
	const t = j(),
		{ params: s, el: n, wrapperEl: r, device: a } = i,
		o = !!s.nested,
		l = e === "on" ? "addEventListener" : "removeEventListener",
		d = e;
	!n ||
		typeof n == "string" ||
		(t[l]("touchstart", i.onDocumentTouchStart, {
			passive: !1,
			capture: o,
		}),
		n[l]("touchstart", i.onTouchStart, { passive: !1 }),
		n[l]("pointerdown", i.onTouchStart, { passive: !1 }),
		t[l]("touchmove", i.onTouchMove, { passive: !1, capture: o }),
		t[l]("pointermove", i.onTouchMove, { passive: !1, capture: o }),
		t[l]("touchend", i.onTouchEnd, { passive: !0 }),
		t[l]("pointerup", i.onTouchEnd, { passive: !0 }),
		t[l]("pointercancel", i.onTouchEnd, { passive: !0 }),
		t[l]("touchcancel", i.onTouchEnd, { passive: !0 }),
		t[l]("pointerout", i.onTouchEnd, { passive: !0 }),
		t[l]("pointerleave", i.onTouchEnd, { passive: !0 }),
		t[l]("contextmenu", i.onTouchEnd, { passive: !0 }),
		(s.preventClicks || s.preventClicksPropagation) &&
			n[l]("click", i.onClick, !0),
		s.cssMode && r[l]("scroll", i.onScroll),
		s.updateOnWindowResize
			? i[d](
					a.ios || a.android
						? "resize orientationchange observerUpdate"
						: "resize observerUpdate",
					ge,
					!0,
				)
			: i[d]("observerUpdate", ge, !0),
		n[l]("load", i.onLoad, { capture: !0 }));
};
function Bt() {
	const { params: e } = this;
	(this.onTouchStart = zt.bind(this)),
		(this.onTouchMove = Ot.bind(this)),
		(this.onTouchEnd = At.bind(this)),
		(this.onDocumentTouchStart = Dt.bind(this)),
		e.cssMode && (this.onScroll = _t.bind(this)),
		(this.onClick = Gt.bind(this)),
		(this.onLoad = Vt.bind(this)),
		ye(this, "on");
}
function Rt() {
	ye(this, "off");
}
var Nt = { attachEvents: Bt, detachEvents: Rt };
const ve = (i, e) => i.grid && e.grid && e.grid.rows > 1;
function $t() {
	const { realIndex: e, initialized: t, params: s, el: n } = this,
		r = s.breakpoints;
	if (!r || (r && Object.keys(r).length === 0)) return;
	const a = j(),
		o =
			s.breakpointsBase === "window" || !s.breakpointsBase
				? s.breakpointsBase
				: "container",
		l =
			["window", "container"].includes(s.breakpointsBase) ||
			!s.breakpointsBase
				? this.el
				: a.querySelector(s.breakpointsBase),
		d = this.getBreakpoint(r, o, l);
	if (!d || this.currentBreakpoint === d) return;
	const f = (d in r ? r[d] : void 0) || this.originalParams,
		u = ve(this, s),
		p = ve(this, f),
		h = this.params.grabCursor,
		v = f.grabCursor,
		P = s.enabled;
	u && !p
		? (n.classList.remove(
				`${s.containerModifierClass}grid`,
				`${s.containerModifierClass}grid-column`,
			),
			this.emitContainerClasses())
		: !u &&
			p &&
			(n.classList.add(`${s.containerModifierClass}grid`),
			((f.grid.fill && f.grid.fill === "column") ||
				(!f.grid.fill && s.grid.fill === "column")) &&
				n.classList.add(`${s.containerModifierClass}grid-column`),
			this.emitContainerClasses()),
		h && !v ? this.unsetGrabCursor() : !h && v && this.setGrabCursor(),
		["navigation", "pagination", "scrollbar"].forEach((I) => {
			if (typeof f[I] > "u") return;
			const C = s[I] && s[I].enabled,
				y = f[I] && f[I].enabled;
			C && !y && this[I].disable(), !C && y && this[I].enable();
		});
	const m = f.direction && f.direction !== s.direction,
		S = s.loop && (f.slidesPerView !== s.slidesPerView || m),
		g = s.loop;
	m && t && this.changeDirection(), N(this.params, f);
	const E = this.params.enabled,
		T = this.params.loop;
	Object.assign(this, {
		allowTouchMove: this.params.allowTouchMove,
		allowSlideNext: this.params.allowSlideNext,
		allowSlidePrev: this.params.allowSlidePrev,
	}),
		P && !E ? this.disable() : !P && E && this.enable(),
		(this.currentBreakpoint = d),
		this.emit("_beforeBreakpoint", f),
		t &&
			(S
				? (this.loopDestroy(), this.loopCreate(e), this.updateSlides())
				: !g && T
					? (this.loopCreate(e), this.updateSlides())
					: g && !T && this.loopDestroy()),
		this.emit("breakpoint", f);
}
function kt(i, e, t) {
	if ((e === void 0 && (e = "window"), !i || (e === "container" && !t)))
		return;
	let s = !1;
	const n = H(),
		r = e === "window" ? n.innerHeight : t.clientHeight,
		a = Object.keys(i).map((o) => {
			if (typeof o == "string" && o.indexOf("@") === 0) {
				const l = Number.parseFloat(o.substr(1));
				return { value: r * l, point: o };
			}
			return { value: o, point: o };
		});
	a.sort(
		(o, l) => Number.parseInt(o.value, 10) - Number.parseInt(l.value, 10),
	);
	for (let o = 0; o < a.length; o += 1) {
		const { point: l, value: d } = a[o];
		e === "window"
			? n.matchMedia(`(min-width: ${d}px)`).matches && (s = l)
			: d <= t.clientWidth && (s = l);
	}
	return s || "max";
}
var Ft = { setBreakpoint: $t, getBreakpoint: kt };
function Ht(i, e) {
	const t = [];
	return (
		i.forEach((s) => {
			typeof s == "object"
				? Object.keys(s).forEach((n) => {
						s[n] && t.push(e + n);
					})
				: typeof s == "string" && t.push(e + s);
		}),
		t
	);
}
function Wt() {
	const { classNames: e, params: t, rtl: s, el: n, device: r } = this,
		a = Ht(
			[
				"initialized",
				t.direction,
				{ "free-mode": this.params.freeMode && t.freeMode.enabled },
				{ autoheight: t.autoHeight },
				{ rtl: s },
				{ grid: t.grid && t.grid.rows > 1 },
				{
					"grid-column":
						t.grid && t.grid.rows > 1 && t.grid.fill === "column",
				},
				{ android: r.android },
				{ ios: r.ios },
				{ "css-mode": t.cssMode },
				{ centered: t.cssMode && t.centeredSlides },
				{ "watch-progress": t.watchSlidesProgress },
			],
			t.containerModifierClass,
		);
	e.push(...a), n.classList.add(...e), this.emitContainerClasses();
}
function jt() {
	const { el: e, classNames: t } = this;
	!e ||
		typeof e == "string" ||
		(e.classList.remove(...t), this.emitContainerClasses());
}
var Yt = { addClasses: Wt, removeClasses: jt };
function Xt() {
	const { isLocked: e, params: t } = this,
		{ slidesOffsetBefore: s } = t;
	if (s) {
		const n = this.slides.length - 1,
			r = this.slidesGrid[n] + this.slidesSizesGrid[n] + s * 2;
		this.isLocked = this.size > r;
	} else this.isLocked = this.snapGrid.length === 1;
	t.allowSlideNext === !0 && (this.allowSlideNext = !this.isLocked),
		t.allowSlidePrev === !0 && (this.allowSlidePrev = !this.isLocked),
		e && e !== this.isLocked && (this.isEnd = !1),
		e !== this.isLocked && this.emit(this.isLocked ? "lock" : "unlock");
}
var qt = { checkOverflow: Xt },
	oe = {
		init: !0,
		direction: "horizontal",
		oneWayMovement: !1,
		swiperElementNodeName: "SWIPER-CONTAINER",
		touchEventsTarget: "wrapper",
		initialSlide: 0,
		speed: 300,
		cssMode: !1,
		updateOnWindowResize: !0,
		resizeObserver: !0,
		nested: !1,
		createElements: !1,
		eventsPrefix: "swiper",
		enabled: !0,
		focusableElements:
			"input, select, option, textarea, button, video, label",
		width: null,
		height: null,
		preventInteractionOnTransition: !1,
		userAgent: null,
		url: null,
		edgeSwipeDetection: !1,
		edgeSwipeThreshold: 20,
		autoHeight: !1,
		setWrapperSize: !1,
		virtualTranslate: !1,
		effect: "slide",
		breakpoints: void 0,
		breakpointsBase: "window",
		spaceBetween: 0,
		slidesPerView: 1,
		slidesPerGroup: 1,
		slidesPerGroupSkip: 0,
		slidesPerGroupAuto: !1,
		centeredSlides: !1,
		centeredSlidesBounds: !1,
		slidesOffsetBefore: 0,
		slidesOffsetAfter: 0,
		normalizeSlideIndex: !0,
		centerInsufficientSlides: !1,
		watchOverflow: !0,
		roundLengths: !1,
		touchRatio: 1,
		touchAngle: 45,
		simulateTouch: !0,
		shortSwipes: !0,
		longSwipes: !0,
		longSwipesRatio: 0.5,
		longSwipesMs: 300,
		followFinger: !0,
		allowTouchMove: !0,
		threshold: 5,
		touchMoveStopPropagation: !1,
		touchStartPreventDefault: !0,
		touchStartForcePreventDefault: !1,
		touchReleaseOnEdges: !1,
		uniqueNavElements: !0,
		resistance: !0,
		resistanceRatio: 0.85,
		watchSlidesProgress: !1,
		grabCursor: !1,
		preventClicks: !0,
		preventClicksPropagation: !0,
		slideToClickedSlide: !1,
		loop: !1,
		loopAddBlankSlides: !0,
		loopAdditionalSlides: 0,
		loopPreventsSliding: !0,
		rewind: !1,
		allowSlidePrev: !0,
		allowSlideNext: !0,
		swipeHandler: null,
		noSwiping: !0,
		noSwipingClass: "swiper-no-swiping",
		noSwipingSelector: null,
		passiveListeners: !0,
		maxBackfaceHiddenSlides: 10,
		containerModifierClass: "swiper-",
		slideClass: "swiper-slide",
		slideBlankClass: "swiper-slide-blank",
		slideActiveClass: "swiper-slide-active",
		slideVisibleClass: "swiper-slide-visible",
		slideFullyVisibleClass: "swiper-slide-fully-visible",
		slideNextClass: "swiper-slide-next",
		slidePrevClass: "swiper-slide-prev",
		wrapperClass: "swiper-wrapper",
		lazyPreloaderClass: "swiper-lazy-preloader",
		lazyPreloadPrevNext: 0,
		runCallbacksOnInit: !0,
		_emitClasses: !1,
	};
function Ut(i, e) {
	return (s) => {
		s === void 0 && (s = {});
		const n = Object.keys(s)[0],
			r = s[n];
		if (typeof r != "object" || r === null) {
			N(e, s);
			return;
		}
		if (
			(i[n] === !0 && (i[n] = { enabled: !0 }),
			n === "navigation" &&
				i[n] &&
				i[n].enabled &&
				!i[n].prevEl &&
				!i[n].nextEl &&
				(i[n].auto = !0),
			["pagination", "scrollbar"].indexOf(n) >= 0 &&
				i[n] &&
				i[n].enabled &&
				!i[n].el &&
				(i[n].auto = !0),
			!(n in i && "enabled" in r))
		) {
			N(e, s);
			return;
		}
		typeof i[n] == "object" && !("enabled" in i[n]) && (i[n].enabled = !0),
			i[n] || (i[n] = { enabled: !1 }),
			N(e, s);
	};
}
const re = {
		eventsEmitter: Ye,
		update: st,
		translate: dt,
		transition: pt,
		slide: bt,
		loop: Pt,
		grabCursor: It,
		events: Nt,
		breakpoints: Ft,
		checkOverflow: qt,
		classes: Yt,
	},
	ne = {};
const ce = class $ {
	constructor() {
		let e, t;
		for (var s = arguments.length, n = new Array(s), r = 0; r < s; r++)
			n[r] = arguments[r];
		n.length === 1 &&
		n[0].constructor &&
		Object.prototype.toString.call(n[0]).slice(8, -1) === "Object"
			? (t = n[0])
			: ([e, t] = n),
			t || (t = {}),
			(t = N({}, t)),
			e && !t.el && (t.el = e);
		const a = j();
		if (
			t.el &&
			typeof t.el == "string" &&
			a.querySelectorAll(t.el).length > 1
		) {
			const c = [];
			return (
				a.querySelectorAll(t.el).forEach((f) => {
					const u = N({}, t, { el: f });
					c.push(new $(u));
				}),
				c
			);
		}
		const o = this;
		(o.__swiper__ = !0),
			(o.support = Te()),
			(o.device = be({ userAgent: t.userAgent })),
			(o.browser = xe()),
			(o.eventsListeners = {}),
			(o.eventsAnyListeners = []),
			(o.modules = [...o.__modules__]),
			t.modules &&
				Array.isArray(t.modules) &&
				o.modules.push(...t.modules);
		const l = {};
		o.modules.forEach((c) => {
			c({
				params: t,
				swiper: o,
				extendParams: Ut(t, l),
				on: o.on.bind(o),
				once: o.once.bind(o),
				off: o.off.bind(o),
				emit: o.emit.bind(o),
			});
		});
		const d = N({}, oe, l);
		return (
			(o.params = N({}, d, ne, t)),
			(o.originalParams = N({}, o.params)),
			(o.passedParams = N({}, t)),
			o.params &&
				o.params.on &&
				Object.keys(o.params.on).forEach((c) => {
					o.on(c, o.params.on[c]);
				}),
			o.params && o.params.onAny && o.onAny(o.params.onAny),
			Object.assign(o, {
				enabled: o.params.enabled,
				el: e,
				classNames: [],
				slides: [],
				slidesGrid: [],
				snapGrid: [],
				slidesSizesGrid: [],
				isHorizontal() {
					return o.params.direction === "horizontal";
				},
				isVertical() {
					return o.params.direction === "vertical";
				},
				activeIndex: 0,
				realIndex: 0,
				isBeginning: !0,
				isEnd: !1,
				translate: 0,
				previousTranslate: 0,
				progress: 0,
				velocity: 0,
				animating: !1,
				cssOverflowAdjustment() {
					return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
				},
				allowSlideNext: o.params.allowSlideNext,
				allowSlidePrev: o.params.allowSlidePrev,
				touchEventsData: {
					isTouched: void 0,
					isMoved: void 0,
					allowTouchCallbacks: void 0,
					touchStartTime: void 0,
					isScrolling: void 0,
					currentTranslate: void 0,
					startTranslate: void 0,
					allowThresholdMove: void 0,
					focusableElements: o.params.focusableElements,
					lastClickTime: 0,
					clickTimeout: void 0,
					velocities: [],
					allowMomentumBounce: void 0,
					startMoving: void 0,
					pointerId: null,
					touchId: null,
				},
				allowClick: !0,
				allowTouchMove: o.params.allowTouchMove,
				touches: {
					startX: 0,
					startY: 0,
					currentX: 0,
					currentY: 0,
					diff: 0,
				},
				imagesToLoad: [],
				imagesLoaded: 0,
			}),
			o.emit("_swiper"),
			o.params.init && o.init(),
			o
		);
	}
	getDirectionLabel(e) {
		return this.isHorizontal()
			? e
			: {
					width: "height",
					"margin-top": "margin-left",
					"margin-bottom ": "margin-right",
					"margin-left": "margin-top",
					"margin-right": "margin-bottom",
					"padding-left": "padding-top",
					"padding-right": "padding-bottom",
					marginRight: "marginBottom",
				}[e];
	}
	getSlideIndex(e) {
		const { slidesEl: t, params: s } = this,
			n = k(t, `.${s.slideClass}, swiper-slide`),
			r = fe(n[0]);
		return fe(e) - r;
	}
	getSlideIndexByData(e) {
		return this.getSlideIndex(
			this.slides.find(
				(t) => t.getAttribute("data-swiper-slide-index") * 1 === e,
			),
		);
	}
	getSlideIndexWhenGrid(e) {
		return (
			this.grid &&
				this.params.grid &&
				this.params.grid.rows > 1 &&
				(this.params.grid.fill === "column"
					? (e = Math.floor(e / this.params.grid.rows))
					: this.params.grid.fill === "row" &&
						(e =
							e %
							Math.ceil(
								this.slides.length / this.params.grid.rows,
							))),
			e
		);
	}
	recalcSlides() {
		const { slidesEl: t, params: s } = this;
		this.slides = k(t, `.${s.slideClass}, swiper-slide`);
	}
	enable() {
		this.enabled ||
			((this.enabled = !0),
			this.params.grabCursor && this.setGrabCursor(),
			this.emit("enable"));
	}
	disable() {
		this.enabled &&
			((this.enabled = !1),
			this.params.grabCursor && this.unsetGrabCursor(),
			this.emit("disable"));
	}
	setProgress(e, t) {
		e = Math.min(Math.max(e, 0), 1);
		const n = this.minTranslate(),
			a = (this.maxTranslate() - n) * e + n;
		this.translateTo(a, typeof t > "u" ? 0 : t),
			this.updateActiveIndex(),
			this.updateSlidesClasses();
	}
	emitContainerClasses() {
		if (!this.params._emitClasses || !this.el) return;
		const t = this.el.className
			.split(" ")
			.filter(
				(s) =>
					s.indexOf("swiper") === 0 ||
					s.indexOf(this.params.containerModifierClass) === 0,
			);
		this.emit("_containerClasses", t.join(" "));
	}
	getSlideClasses(e) {
		return this.destroyed
			? ""
			: e.className
					.split(" ")
					.filter(
						(s) =>
							s.indexOf("swiper-slide") === 0 ||
							s.indexOf(this.params.slideClass) === 0,
					)
					.join(" ");
	}
	emitSlidesClasses() {
		if (!this.params._emitClasses || !this.el) return;
		const t = [];
		this.slides.forEach((s) => {
			const n = this.getSlideClasses(s);
			t.push({ slideEl: s, classNames: n }),
				this.emit("_slideClass", s, n);
		}),
			this.emit("_slideClasses", t);
	}
	slidesPerViewDynamic(e, t) {
		e === void 0 && (e = "current"), t === void 0 && (t = !1);
		const {
			params: n,
			slides: r,
			slidesGrid: a,
			slidesSizesGrid: o,
			size: l,
			activeIndex: d,
		} = this;
		let c = 1;
		if (typeof n.slidesPerView == "number") return n.slidesPerView;
		if (n.centeredSlides) {
			let f = r[d] ? Math.ceil(r[d].swiperSlideSize) : 0,
				u;
			for (let p = d + 1; p < r.length; p += 1)
				r[p] &&
					!u &&
					((f += Math.ceil(r[p].swiperSlideSize)),
					(c += 1),
					f > l && (u = !0));
			for (let p = d - 1; p >= 0; p -= 1)
				r[p] &&
					!u &&
					((f += r[p].swiperSlideSize), (c += 1), f > l && (u = !0));
		} else if (e === "current")
			for (let f = d + 1; f < r.length; f += 1)
				(t ? a[f] + o[f] - a[d] < l : a[f] - a[d] < l) && (c += 1);
		else for (let f = d - 1; f >= 0; f -= 1) a[d] - a[f] < l && (c += 1);
		return c;
	}
	update() {
		const e = this;
		if (!e || e.destroyed) return;
		const { snapGrid: t, params: s } = e;
		s.breakpoints && e.setBreakpoint(),
			[...e.el.querySelectorAll('[loading="lazy"]')].forEach((a) => {
				a.complete && U(e, a);
			}),
			e.updateSize(),
			e.updateSlides(),
			e.updateProgress(),
			e.updateSlidesClasses();
		function n() {
			const a = e.rtlTranslate ? e.translate * -1 : e.translate,
				o = Math.min(Math.max(a, e.maxTranslate()), e.minTranslate());
			e.setTranslate(o), e.updateActiveIndex(), e.updateSlidesClasses();
		}
		let r;
		if (s.freeMode && s.freeMode.enabled && !s.cssMode)
			n(), s.autoHeight && e.updateAutoHeight();
		else {
			if (
				(s.slidesPerView === "auto" || s.slidesPerView > 1) &&
				e.isEnd &&
				!s.centeredSlides
			) {
				const a =
					e.virtual && s.virtual.enabled
						? e.virtual.slides
						: e.slides;
				r = e.slideTo(a.length - 1, 0, !1, !0);
			} else r = e.slideTo(e.activeIndex, 0, !1, !0);
			r || n();
		}
		s.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
			e.emit("update");
	}
	changeDirection(e, t) {
		t === void 0 && (t = !0);
		const n = this.params.direction;
		return (
			e || (e = n === "horizontal" ? "vertical" : "horizontal"),
			e === n ||
				(e !== "horizontal" && e !== "vertical") ||
				(this.el.classList.remove(
					`${this.params.containerModifierClass}${n}`,
				),
				this.el.classList.add(
					`${this.params.containerModifierClass}${e}`,
				),
				this.emitContainerClasses(),
				(this.params.direction = e),
				this.slides.forEach((r) => {
					e === "vertical"
						? (r.style.width = "")
						: (r.style.height = "");
				}),
				this.emit("changeDirection"),
				t && this.update()),
			this
		);
	}
	changeLanguageDirection(e) {
		(this.rtl && e === "rtl") ||
			(!this.rtl && e === "ltr") ||
			((this.rtl = e === "rtl"),
			(this.rtlTranslate =
				this.params.direction === "horizontal" && this.rtl),
			this.rtl
				? (this.el.classList.add(
						`${this.params.containerModifierClass}rtl`,
					),
					(this.el.dir = "rtl"))
				: (this.el.classList.remove(
						`${this.params.containerModifierClass}rtl`,
					),
					(this.el.dir = "ltr")),
			this.update());
	}
	mount(e) {
		if (this.mounted) return !0;
		let s = e || this.params.el;
		if ((typeof s == "string" && (s = document.querySelector(s)), !s))
			return !1;
		(s.swiper = this),
			s.parentNode &&
				s.parentNode.host &&
				s.parentNode.host.nodeName ===
					this.params.swiperElementNodeName.toUpperCase() &&
				(this.isElement = !0);
		const n = () =>
			`.${(this.params.wrapperClass || "").trim().split(" ").join(".")}`;
		let a =
			s && s.shadowRoot && s.shadowRoot.querySelector
				? s.shadowRoot.querySelector(n())
				: k(s, n())[0];
		return (
			!a &&
				this.params.createElements &&
				((a = ae("div", this.params.wrapperClass)),
				s.append(a),
				k(s, `.${this.params.slideClass}`).forEach((o) => {
					a.append(o);
				})),
			Object.assign(this, {
				el: s,
				wrapperEl: a,
				slidesEl:
					this.isElement && !s.parentNode.host.slideSlots
						? s.parentNode.host
						: a,
				hostEl: this.isElement ? s.parentNode.host : s,
				mounted: !0,
				rtl:
					s.dir.toLowerCase() === "rtl" ||
					F(s, "direction") === "rtl",
				rtlTranslate:
					this.params.direction === "horizontal" &&
					(s.dir.toLowerCase() === "rtl" ||
						F(s, "direction") === "rtl"),
				wrongRTL: F(a, "display") === "-webkit-box",
			}),
			!0
		);
	}
	init(e) {
		if (this.initialized || this.mount(e) === !1) return this;
		this.emit("beforeInit"),
			this.params.breakpoints && this.setBreakpoint(),
			this.addClasses(),
			this.updateSize(),
			this.updateSlides(),
			this.params.watchOverflow && this.checkOverflow(),
			this.params.grabCursor && this.enabled && this.setGrabCursor(),
			this.params.loop && this.virtual && this.params.virtual.enabled
				? this.slideTo(
						this.params.initialSlide + this.virtual.slidesBefore,
						0,
						this.params.runCallbacksOnInit,
						!1,
						!0,
					)
				: this.slideTo(
						this.params.initialSlide,
						0,
						this.params.runCallbacksOnInit,
						!1,
						!0,
					),
			this.params.loop && this.loopCreate(void 0, !0),
			this.attachEvents();
		const n = [...this.el.querySelectorAll('[loading="lazy"]')];
		return (
			this.isElement &&
				n.push(...this.hostEl.querySelectorAll('[loading="lazy"]')),
			n.forEach((r) => {
				r.complete
					? U(this, r)
					: r.addEventListener("load", (a) => {
							U(this, a.target);
						});
			}),
			le(this),
			(this.initialized = !0),
			le(this),
			this.emit("init"),
			this.emit("afterInit"),
			this
		);
	}
	destroy(e, t) {
		e === void 0 && (e = !0), t === void 0 && (t = !0);
		const { params: n, el: r, wrapperEl: a, slides: o } = this;
		return (
			typeof this.params > "u" ||
				this.destroyed ||
				(this.emit("beforeDestroy"),
				(this.initialized = !1),
				this.detachEvents(),
				n.loop && this.loopDestroy(),
				t &&
					(this.removeClasses(),
					r && typeof r != "string" && r.removeAttribute("style"),
					a && a.removeAttribute("style"),
					o &&
						o.length &&
						o.forEach((l) => {
							l.classList.remove(
								n.slideVisibleClass,
								n.slideFullyVisibleClass,
								n.slideActiveClass,
								n.slideNextClass,
								n.slidePrevClass,
							),
								l.removeAttribute("style"),
								l.removeAttribute("data-swiper-slide-index");
						})),
				this.emit("destroy"),
				Object.keys(this.eventsListeners).forEach((l) => {
					this.off(l);
				}),
				e !== !1 &&
					(this.el &&
						typeof this.el != "string" &&
						(this.el.swiper = null),
					Ve(this)),
				(this.destroyed = !0)),
			null
		);
	}
	static extendDefaults(e) {
		N(ne, e);
	}
	static get extendedDefaults() {
		return ne;
	}
	static get defaults() {
		return oe;
	}
	static installModule(e) {
		$.prototype.__modules__ || ($.prototype.__modules__ = []);
		const t = $.prototype.__modules__;
		typeof e == "function" && t.indexOf(e) < 0 && t.push(e);
	}
	static use(e) {
		return Array.isArray(e)
			? (e.forEach((t) => $.installModule(t)), $)
			: ($.installModule(e), $);
	}
};
Object.keys(re).forEach((i) => {
	Object.keys(re[i]).forEach((e) => {
		ce.prototype[e] = re[i][e];
	});
});
ce.use([We, je]);
const Pe = [
	"eventsPrefix",
	"injectStyles",
	"injectStylesUrls",
	"modules",
	"init",
	"_direction",
	"oneWayMovement",
	"swiperElementNodeName",
	"touchEventsTarget",
	"initialSlide",
	"_speed",
	"cssMode",
	"updateOnWindowResize",
	"resizeObserver",
	"nested",
	"focusableElements",
	"_enabled",
	"_width",
	"_height",
	"preventInteractionOnTransition",
	"userAgent",
	"url",
	"_edgeSwipeDetection",
	"_edgeSwipeThreshold",
	"_freeMode",
	"_autoHeight",
	"setWrapperSize",
	"virtualTranslate",
	"_effect",
	"breakpoints",
	"breakpointsBase",
	"_spaceBetween",
	"_slidesPerView",
	"maxBackfaceHiddenSlides",
	"_grid",
	"_slidesPerGroup",
	"_slidesPerGroupSkip",
	"_slidesPerGroupAuto",
	"_centeredSlides",
	"_centeredSlidesBounds",
	"_slidesOffsetBefore",
	"_slidesOffsetAfter",
	"normalizeSlideIndex",
	"_centerInsufficientSlides",
	"_watchOverflow",
	"roundLengths",
	"touchRatio",
	"touchAngle",
	"simulateTouch",
	"_shortSwipes",
	"_longSwipes",
	"longSwipesRatio",
	"longSwipesMs",
	"_followFinger",
	"allowTouchMove",
	"_threshold",
	"touchMoveStopPropagation",
	"touchStartPreventDefault",
	"touchStartForcePreventDefault",
	"touchReleaseOnEdges",
	"uniqueNavElements",
	"_resistance",
	"_resistanceRatio",
	"_watchSlidesProgress",
	"_grabCursor",
	"preventClicks",
	"preventClicksPropagation",
	"_slideToClickedSlide",
	"_loop",
	"loopAdditionalSlides",
	"loopAddBlankSlides",
	"loopPreventsSliding",
	"_rewind",
	"_allowSlidePrev",
	"_allowSlideNext",
	"_swipeHandler",
	"_noSwiping",
	"noSwipingClass",
	"noSwipingSelector",
	"passiveListeners",
	"containerModifierClass",
	"slideClass",
	"slideActiveClass",
	"slideVisibleClass",
	"slideFullyVisibleClass",
	"slideNextClass",
	"slidePrevClass",
	"slideBlankClass",
	"wrapperClass",
	"lazyPreloaderClass",
	"lazyPreloadPrevNext",
	"runCallbacksOnInit",
	"observer",
	"observeParents",
	"observeSlideChildren",
	"a11y",
	"_autoplay",
	"_controller",
	"coverflowEffect",
	"cubeEffect",
	"fadeEffect",
	"flipEffect",
	"creativeEffect",
	"cardsEffect",
	"hashNavigation",
	"history",
	"keyboard",
	"mousewheel",
	"_navigation",
	"_pagination",
	"parallax",
	"_scrollbar",
	"_thumbs",
	"virtual",
	"zoom",
	"control",
];
function W(i) {
	return (
		typeof i == "object" &&
		i !== null &&
		i.constructor &&
		Object.prototype.toString.call(i).slice(8, -1) === "Object" &&
		!i.__swiper__
	);
}
function Y(i, e) {
	const t = ["__proto__", "constructor", "prototype"];
	Object.keys(e)
		.filter((s) => t.indexOf(s) < 0)
		.forEach((s) => {
			typeof i[s] > "u"
				? (i[s] = e[s])
				: W(e[s]) && W(i[s]) && Object.keys(e[s]).length > 0
					? e[s].__swiper__
						? (i[s] = e[s])
						: Y(i[s], e[s])
					: (i[s] = e[s]);
		});
}
function Ce(i) {
	return (
		i === void 0 && (i = {}),
		i.navigation &&
			typeof i.navigation.nextEl > "u" &&
			typeof i.navigation.prevEl > "u"
	);
}
function Me(i) {
	return (
		i === void 0 && (i = {}), i.pagination && typeof i.pagination.el > "u"
	);
}
function Ie(i) {
	return i === void 0 && (i = {}), i.scrollbar && typeof i.scrollbar.el > "u";
}
function Le(i) {
	i === void 0 && (i = "");
	const e = i
			.split(" ")
			.map((s) => s.trim())
			.filter((s) => !!s),
		t = [];
	return (
		e.forEach((s) => {
			t.indexOf(s) < 0 && t.push(s);
		}),
		t.join(" ")
	);
}
function Kt(i) {
	return (
		i === void 0 && (i = ""),
		i
			? i.includes("swiper-wrapper")
				? i
				: `swiper-wrapper ${i}`
			: "swiper-wrapper"
	);
}
function Zt(i) {
	let {
		swiper: e,
		slides: t,
		passedParams: s,
		changedParams: n,
		nextEl: r,
		prevEl: a,
		scrollbarEl: o,
		paginationEl: l,
	} = i;
	const d = n.filter(
			(b) =>
				b !== "children" && b !== "direction" && b !== "wrapperClass",
		),
		{
			params: c,
			pagination: f,
			navigation: u,
			scrollbar: p,
			virtual: h,
			thumbs: v,
		} = e;
	let P, m, S, g, E, T, I, C;
	n.includes("thumbs") &&
		s.thumbs &&
		s.thumbs.swiper &&
		!s.thumbs.swiper.destroyed &&
		c.thumbs &&
		(!c.thumbs.swiper || c.thumbs.swiper.destroyed) &&
		(P = !0),
		n.includes("controller") &&
			s.controller &&
			s.controller.control &&
			c.controller &&
			!c.controller.control &&
			(m = !0),
		n.includes("pagination") &&
			s.pagination &&
			(s.pagination.el || l) &&
			(c.pagination || c.pagination === !1) &&
			f &&
			!f.el &&
			(S = !0),
		n.includes("scrollbar") &&
			s.scrollbar &&
			(s.scrollbar.el || o) &&
			(c.scrollbar || c.scrollbar === !1) &&
			p &&
			!p.el &&
			(g = !0),
		n.includes("navigation") &&
			s.navigation &&
			(s.navigation.prevEl || a) &&
			(s.navigation.nextEl || r) &&
			(c.navigation || c.navigation === !1) &&
			u &&
			!u.prevEl &&
			!u.nextEl &&
			(E = !0);
	const y = (b) => {
		e[b] &&
			(e[b].destroy(),
			b === "navigation"
				? (e.isElement && (e[b].prevEl.remove(), e[b].nextEl.remove()),
					(c[b].prevEl = void 0),
					(c[b].nextEl = void 0),
					(e[b].prevEl = void 0),
					(e[b].nextEl = void 0))
				: (e.isElement && e[b].el.remove(),
					(c[b].el = void 0),
					(e[b].el = void 0)));
	};
	n.includes("loop") &&
		e.isElement &&
		(c.loop && !s.loop
			? (T = !0)
			: !c.loop && s.loop
				? (I = !0)
				: (C = !0)),
		d.forEach((b) => {
			if (W(c[b]) && W(s[b]))
				Object.assign(c[b], s[b]),
					(b === "navigation" ||
						b === "pagination" ||
						b === "scrollbar") &&
						"enabled" in s[b] &&
						!s[b].enabled &&
						y(b);
			else {
				const w = s[b];
				(w === !0 || w === !1) &&
				(b === "navigation" || b === "pagination" || b === "scrollbar")
					? w === !1 && y(b)
					: (c[b] = s[b]);
			}
		}),
		d.includes("controller") &&
			!m &&
			e.controller &&
			e.controller.control &&
			c.controller &&
			c.controller.control &&
			(e.controller.control = c.controller.control),
		n.includes("children") && t && h && c.virtual.enabled
			? ((h.slides = t), h.update(!0))
			: n.includes("virtual") &&
				h &&
				c.virtual.enabled &&
				(t && (h.slides = t), h.update(!0)),
		n.includes("children") && t && c.loop && (C = !0),
		P && v.init() && v.update(!0),
		m && (e.controller.control = c.controller.control),
		S &&
			(e.isElement &&
				(!l || typeof l == "string") &&
				((l = document.createElement("div")),
				l.classList.add("swiper-pagination"),
				l.part.add("pagination"),
				e.el.appendChild(l)),
			l && (c.pagination.el = l),
			f.init(),
			f.render(),
			f.update()),
		g &&
			(e.isElement &&
				(!o || typeof o == "string") &&
				((o = document.createElement("div")),
				o.classList.add("swiper-scrollbar"),
				o.part.add("scrollbar"),
				e.el.appendChild(o)),
			o && (c.scrollbar.el = o),
			p.init(),
			p.updateSize(),
			p.setTranslate()),
		E &&
			(e.isElement &&
				((!r || typeof r == "string") &&
					((r = document.createElement("div")),
					r.classList.add("swiper-button-next"),
					pe(r, e.hostEl.constructor.nextButtonSvg),
					r.part.add("button-next"),
					e.el.appendChild(r)),
				(!a || typeof a == "string") &&
					((a = document.createElement("div")),
					a.classList.add("swiper-button-prev"),
					pe(a, e.hostEl.constructor.prevButtonSvg),
					a.part.add("button-prev"),
					e.el.appendChild(a))),
			r && (c.navigation.nextEl = r),
			a && (c.navigation.prevEl = a),
			u.init(),
			u.update()),
		n.includes("allowSlideNext") && (e.allowSlideNext = s.allowSlideNext),
		n.includes("allowSlidePrev") && (e.allowSlidePrev = s.allowSlidePrev),
		n.includes("direction") && e.changeDirection(s.direction, !1),
		(T || C) && e.loopDestroy(),
		(I || C) && e.loopCreate(),
		e.update();
}
function Jt(i, e) {
	i === void 0 && (i = {}), e === void 0 && (e = !0);
	const t = { on: {} },
		s = {},
		n = {};
	Y(t, oe), (t._emitClasses = !0), (t.init = !1);
	const r = {},
		a = Pe.map((l) => l.replace(/_/, "")),
		o = Object.assign({}, i);
	return (
		Object.keys(o).forEach((l) => {
			typeof i[l] > "u" ||
				(a.indexOf(l) >= 0
					? W(i[l])
						? ((t[l] = {}),
							(n[l] = {}),
							Y(t[l], i[l]),
							Y(n[l], i[l]))
						: ((t[l] = i[l]), (n[l] = i[l]))
					: l.search(/on[A-Z]/) === 0 && typeof i[l] == "function"
						? e
							? (s[`${l[2].toLowerCase()}${l.substr(3)}`] = i[l])
							: (t.on[`${l[2].toLowerCase()}${l.substr(3)}`] =
									i[l])
						: (r[l] = i[l]));
		}),
		["navigation", "pagination", "scrollbar"].forEach((l) => {
			t[l] === !0 && (t[l] = {}), t[l] === !1 && delete t[l];
		}),
		{ params: t, passedParams: n, rest: r, events: s }
	);
}
function Qt(i, e) {
	const {
		el: t,
		nextEl: s,
		prevEl: n,
		paginationEl: r,
		scrollbarEl: a,
		swiper: o,
	} = i;
	Ce(e) &&
		s &&
		n &&
		((o.params.navigation.nextEl = s),
		(o.originalParams.navigation.nextEl = s),
		(o.params.navigation.prevEl = n),
		(o.originalParams.navigation.prevEl = n)),
		Me(e) &&
			r &&
			((o.params.pagination.el = r),
			(o.originalParams.pagination.el = r)),
		Ie(e) &&
			a &&
			((o.params.scrollbar.el = a), (o.originalParams.scrollbar.el = a)),
		o.init(t);
}
function ei(i, e, t, s, n) {
	const r = [];
	if (!e) return r;
	const a = (l) => {
		r.indexOf(l) < 0 && r.push(l);
	};
	if (t && s) {
		const l = s.map(n),
			d = t.map(n);
		l.join("") !== d.join("") && a("children"),
			s.length !== t.length && a("children");
	}
	return (
		Pe.filter((l) => l[0] === "_")
			.map((l) => l.replace(/_/, ""))
			.forEach((l) => {
				if (l in i && l in e)
					if (W(i[l]) && W(e[l])) {
						const d = Object.keys(i[l]),
							c = Object.keys(e[l]);
						d.length !== c.length
							? a(l)
							: (d.forEach((f) => {
									i[l][f] !== e[l][f] && a(l);
								}),
								c.forEach((f) => {
									i[l][f] !== e[l][f] && a(l);
								}));
					} else i[l] !== e[l] && a(l);
			}),
		r
	);
}
const ti = (i) => {
	!i ||
		i.destroyed ||
		!i.params.virtual ||
		(i.params.virtual && !i.params.virtual.enabled) ||
		(i.updateSlides(),
		i.updateProgress(),
		i.updateSlidesClasses(),
		i.emit("_virtualUpdated"),
		i.parallax &&
			i.params.parallax &&
			i.params.parallax.enabled &&
			i.parallax.setTranslate());
};
function J() {
	return (
		(J = Object.assign
			? Object.assign.bind()
			: (i) => {
					for (var e = 1; e < arguments.length; e++) {
						var t = arguments[e];
						for (var s in t) Object.hasOwn(t, s) && (i[s] = t[s]);
					}
					return i;
				}),
		J.apply(this, arguments)
	);
}
function ze(i) {
	return (
		i.type &&
		i.type.displayName &&
		i.type.displayName.includes("SwiperSlide")
	);
}
function Oe(i) {
	const e = [];
	return (
		G.Children.toArray(i).forEach((t) => {
			ze(t)
				? e.push(t)
				: t.props &&
					t.props.children &&
					Oe(t.props.children).forEach((s) => e.push(s));
		}),
		e
	);
}
function ii(i) {
	const e = [],
		t = {
			"container-start": [],
			"container-end": [],
			"wrapper-start": [],
			"wrapper-end": [],
		};
	return (
		G.Children.toArray(i).forEach((s) => {
			if (ze(s)) e.push(s);
			else if (s.props && s.props.slot && t[s.props.slot])
				t[s.props.slot].push(s);
			else if (s.props && s.props.children) {
				const n = Oe(s.props.children);
				n.length > 0
					? n.forEach((r) => e.push(r))
					: t["container-end"].push(s);
			} else t["container-end"].push(s);
		}),
		{ slides: e, slots: t }
	);
}
function si(i, e, t) {
	if (!t) return null;
	const s = (c) => {
			let f = c;
			return (
				c < 0
					? (f = e.length + c)
					: f >= e.length && (f = f - e.length),
				f
			);
		},
		n = i.isHorizontal()
			? { [i.rtlTranslate ? "right" : "left"]: `${t.offset}px` }
			: { top: `${t.offset}px` },
		{ from: r, to: a } = t,
		o = i.params.loop ? -e.length : 0,
		l = i.params.loop ? e.length * 2 : e.length,
		d = [];
	for (let c = o; c < l; c += 1) c >= r && c <= a && d.push(e[s(c)]);
	return d.map((c, f) =>
		G.cloneElement(c, {
			swiper: i,
			style: n,
			key: c.props.virtualIndex || c.key || `slide-${f}`,
		}),
	);
}
function X(i, e) {
	return typeof window > "u" ? z.useEffect(i, e) : z.useLayoutEffect(i, e);
}
const de = z.createContext(null),
	oi = () => z.useContext(de),
	Ae = z.createContext(null),
	di = () => z.useContext(Ae),
	ri = z.forwardRef((i, e) => {
		let {
				className: t,
				tag: s = "div",
				wrapperTag: n = "div",
				children: r,
				onSwiper: a,
				...o
			} = i === void 0 ? {} : i,
			l = !1;
		const [d, c] = z.useState("swiper"),
			[f, u] = z.useState(null),
			[p, h] = z.useState(!1),
			v = z.useRef(!1),
			P = z.useRef(null),
			m = z.useRef(null),
			S = z.useRef(null),
			g = z.useRef(null),
			E = z.useRef(null),
			T = z.useRef(null),
			I = z.useRef(null),
			C = z.useRef(null),
			{ params: y, passedParams: b, rest: w, events: x } = Jt(o),
			{ slides: M, slots: A } = ii(r),
			D = () => {
				h(!p);
			};
		Object.assign(y.on, {
			_containerClasses(O, R) {
				c(R);
			},
		});
		const B = () => {
			Object.assign(y.on, x), (l = !0);
			const O = { ...y };
			if (
				(delete O.wrapperClass,
				(m.current = new ce(O)),
				m.current.virtual && m.current.params.virtual.enabled)
			) {
				m.current.virtual.slides = M;
				const R = {
					cache: !1,
					slides: M,
					renderExternal: u,
					renderExternalUpdate: !1,
				};
				Y(m.current.params.virtual, R),
					Y(m.current.originalParams.virtual, R);
			}
		};
		P.current || B(), m.current && m.current.on("_beforeBreakpoint", D);
		const L = () => {
				l ||
					!x ||
					!m.current ||
					Object.keys(x).forEach((O) => {
						m.current.on(O, x[O]);
					});
			},
			_ = () => {
				!x ||
					!m.current ||
					Object.keys(x).forEach((O) => {
						m.current.off(O, x[O]);
					});
			};
		z.useEffect(() => () => {
			m.current && m.current.off("_beforeBreakpoint", D);
		}),
			z.useEffect(() => {
				!v.current &&
					m.current &&
					(m.current.emitSlidesClasses(), (v.current = !0));
			}),
			X(() => {
				if ((e && (e.current = P.current), !!P.current))
					return (
						m.current.destroyed && B(),
						Qt(
							{
								el: P.current,
								nextEl: E.current,
								prevEl: T.current,
								paginationEl: I.current,
								scrollbarEl: C.current,
								swiper: m.current,
							},
							y,
						),
						a && !m.current.destroyed && a(m.current),
						() => {
							m.current &&
								!m.current.destroyed &&
								m.current.destroy(!0, !1);
						}
					);
			}, []),
			X(() => {
				L();
				const O = ei(b, S.current, M, g.current, (R) => R.key);
				return (
					(S.current = b),
					(g.current = M),
					O.length &&
						m.current &&
						!m.current.destroyed &&
						Zt({
							swiper: m.current,
							slides: M,
							passedParams: b,
							changedParams: O,
							nextEl: E.current,
							prevEl: T.current,
							scrollbarEl: C.current,
							paginationEl: I.current,
						}),
					() => {
						_();
					}
				);
			}),
			X(() => {
				ti(m.current);
			}, [f]);
		function V() {
			return y.virtual
				? si(m.current, M, f)
				: M.map((O, R) =>
						G.cloneElement(O, {
							swiper: m.current,
							swiperSlideIndex: R,
						}),
					);
		}
		return G.createElement(
			s,
			J({ ref: P, className: Le(`${d}${t ? ` ${t}` : ""}`) }, w),
			G.createElement(
				Ae.Provider,
				{ value: m.current },
				A["container-start"],
				G.createElement(
					n,
					{ className: Kt(y.wrapperClass) },
					A["wrapper-start"],
					V(),
					A["wrapper-end"],
				),
				Ce(y) &&
					G.createElement(
						G.Fragment,
						null,
						G.createElement("div", {
							ref: T,
							className: "swiper-button-prev",
						}),
						G.createElement("div", {
							ref: E,
							className: "swiper-button-next",
						}),
					),
				Ie(y) &&
					G.createElement("div", {
						ref: C,
						className: "swiper-scrollbar",
					}),
				Me(y) &&
					G.createElement("div", {
						ref: I,
						className: "swiper-pagination",
					}),
				A["container-end"],
			),
		);
	});
ri.displayName = "Swiper";
const ni = z.forwardRef((i, e) => {
	const {
		tag: t = "div",
		children: s,
		className: n = "",
		swiper: r,
		zoom: a,
		lazy: o,
		virtualIndex: l,
		swiperSlideIndex: d,
		...c
	} = i === void 0 ? {} : i;
	const f = z.useRef(null),
		[u, p] = z.useState("swiper-slide"),
		[h, v] = z.useState(!1);
	function P(E, T, I) {
		T === f.current && p(I);
	}
	X(() => {
		if (
			(typeof d < "u" && (f.current.swiperSlideIndex = d),
			e && (e.current = f.current),
			!(!f.current || !r))
		) {
			if (r.destroyed) {
				u !== "swiper-slide" && p("swiper-slide");
				return;
			}
			return (
				r.on("_slideClass", P),
				() => {
					r && r.off("_slideClass", P);
				}
			);
		}
	}),
		X(() => {
			r && f.current && !r.destroyed && p(r.getSlideClasses(f.current));
		}, [r]);
	const m = {
			isActive: u.indexOf("swiper-slide-active") >= 0,
			isVisible: u.indexOf("swiper-slide-visible") >= 0,
			isPrev: u.indexOf("swiper-slide-prev") >= 0,
			isNext: u.indexOf("swiper-slide-next") >= 0,
		},
		S = () => (typeof s == "function" ? s(m) : s),
		g = () => {
			v(!0);
		};
	return G.createElement(
		t,
		J(
			{
				ref: f,
				className: Le(`${u}${n ? ` ${n}` : ""}`),
				"data-swiper-slide-index": l,
				onLoad: g,
			},
			c,
		),
		a &&
			G.createElement(
				de.Provider,
				{ value: m },
				G.createElement(
					"div",
					{
						className: "swiper-zoom-container",
						"data-swiper-zoom": typeof a == "number" ? a : void 0,
					},
					S(),
					o &&
						!h &&
						G.createElement("div", {
							className: "swiper-lazy-preloader",
						}),
				),
			),
		!a &&
			G.createElement(
				de.Provider,
				{ value: m },
				S(),
				o &&
					!h &&
					G.createElement("div", {
						className: "swiper-lazy-preloader",
					}),
			),
	);
});
ni.displayName = "SwiperSlide";
export {
	ri as Swiper,
	ni as SwiperSlide,
	di as useSwiper,
	oi as useSwiperSlide,
};
