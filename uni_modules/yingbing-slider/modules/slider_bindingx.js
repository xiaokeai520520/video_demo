const Binding = uni.requireNativePlugin('bindingx')
const animation = uni.requireNativePlugin('animation')
export default {
	data () {
		return {
			disableTouch: false,
			isTouch: false,
			touchTime: 0,
			interval: false,
			loadingType: '',
			direction: ''
		}
	},
	beforeDestroy () {
		if ( this.sliderBinding ) {
			Binding.unbind({
				token: this.sliderBinding.token,
				eventType: 'pan'
			})
			this.sliderBinding = null
		}
		if ( this.sliderAnimationBinding ) {
			Binding.unbind({
				token: this.sliderAnimationBinding.token,
				eventType: 'timing'
			})
			this.sliderAnimationBinding = null
		}
	},
	methods: {
		slidertouchstart (event) {
			if ( this.isTouch || this.disableTouch ) {
				return
			}
			this.isTouch = true
			this.touchTime = 0
			this.interval = true
			this.setInterval()
			let touch = event.touches[0]
			this.startX = touch.pageX
			this.startY = touch.pageY
		},
		slidertouchmove (event) {
			if ( this.isTouch && !this.disableTouch ) {
				let touch = event.touches[0]
				let offset = this.vertical ? touch.pageY - this.startY : touch.pageX - this.startX
				if ( !this.direction ) {
					if ( Math.abs(offset) < this.sliderFault ) return
					if ( offset < 0 ) {
						if ( this.nextIndex < this.count && (this.nextIndex != 0 || this.circular) ) {
							this.direction = 'next'
						} else if ( this.pullupable && this.loadingState != 'loading' && this.loadingState != 'success' && this.loadingState != 'fail' ) {
							this.loadingType = 'pullup'
							this.disableTouch = true
							this.clearInterval()
							this.pulling()
						}
					} else {
						if ( this.prevIndex >= 0 && (this.prevIndex != this.count - 1 || this.circular) ) {
							this.direction = 'prev'
						} else if ( this.pulldownable && this.loadingState != 'loading' && this.loadingState != 'success' && this.loadingState != 'fail' ) {
							this.loadingType = 'pulldown'
							this.disableTouch = true
							this.clearInterval()
							this.pulling()
						}
					}
				}
				if ( this.direction ) {
					this.disableTouch = true
					this.slideTouchAction()
				} else {
					this.resetPageBinding()
				}
			}
		},
		slidertouchend (e) {
			if ( this.isTouch && !this.disableTouch ) {
				this.disableTouch = true
				this.clearInterval()
				this.resetPageBinding()
			}
		},
		async slideTouchAction () {
			let props = []
			let rect = await this.getRect(this.$refs.yingbingSlider)
			let size = this.vertical ? rect.height : rect.width
			let translate = this.translate
			let key = this.vertical ? 'y' : 'x'
			if ( this.prevIndex > -1 ) {
				props.push({
					element: this.getEl('yingbingSliderItem_' + this.prevIndex),
					property: 'transform.' + translate,
					expression: this.direction == 'next' ? `${key} > 0 ? ${-size} : (abs(${key}) <= ${size} ? ${key} - ${size} : ${-2 * size})` : `${key} < 0 ? ${-size} : (abs(${key}) <= ${size} ? ${key} - ${size} : ${-2 * size})`
				})
			}
			props.push({
				element: this.getEl('yingbingSliderItem_' + this.currentIndex),
				property: 'transform.' + translate,
				expression: this.direction == 'next' ? `${key} > 0 ? 0 : (abs(${key}) <= ${size} ? ${key} + 0 : ${-size})` : `${key} < 0 ? 0 : (abs(${key}) <= ${size} ? ${key} + 0 : ${-size})`
			})
			if ( this.nextIndex < this.count ) {
				props.push({
					element: this.getEl('yingbingSliderItem_' + this.nextIndex),
					property: 'transform.' + translate,
					expression: this.direction == 'next' ? `${key} > 0 ? ${size} : (abs(${key}) <= ${size} ? ${key} + ${size} : 0)` : `${key} < 0 ? ${size} : (abs(${key}) <= ${size} ? ${key} + ${size} : 0)`
				})
			}
			this.sliderBinding = Binding.bind({
				anchor: this.getEl('yingbingSlider'),
				eventType: 'pan',
				props: props
			}, (e) => {
				if ((e.state == 'end' || e.state == 'cancel') && this.sliderBinding) {
					this.clearInterval()
					Binding.unbind({
						token: this.sliderBinding.token,
						eventType: 'pan'
					})
					this.sliderBinding = null
					let value = this.direction == 'next' ? 1 : -1;
					if (this.touchTime <= 200) {
						this.pageAnimation(-value * size, size);
					} else {
						let deltaX = Binding.getComputedStyle(this.getEl('yingbingSliderItem_' + this.currentIndex))[translate]
						if (Math.abs(deltaX) >= size / 4) {
							this.pageAnimation(-value * size, size)
						} else {
							this.pageAnimation(0, size);
						}
					}
				}
			})
		},
		slideToNextBindingX () {
			if ( !this.disableTouch && this.nextIndex < this.count && (this.nextIndex != 0 || this.circular) ) {
				this.direction = 'next'
				this.slideToBindingX()
			}
		},
		slideToPrevBindingX () {
			if ( !this.disableTouch && this.prevIndex >= 0 && (this.prevIndex != this.count - 1 || this.circular) ) {
				this.direction = 'prev'
				this.slideToBindingX()
			}
		},
		async slideToBindingX () {
			this.disableTouch = true
			let value = this.direction == 'next' ? 1 : -1;
			let rect = await this.getRect(this.$refs.yingbingSlider)
			let size = this.vertical ? rect.height : rect.width
			this.pageAnimation(-value * size, size, true)
		},
		getRect (el) {
			return new Promise(resolve => {
				uni.requireNativePlugin('dom').getComponentRect(el, res => {
					resolve(res.size)
				})
			})
		},
		setInterval () {
			this.touchTimer = setTimeout(() => {
				this.touchTime += 10
				if ( this.interval ) {
					this.setInterval()
				}
			}, 10)
		},
		clearInterval () {
			this.interval = false
			if ( this.touchTimer ) {
				clearTimeout(this.touchTimer)
				this.touchTimer = null
			}
		},
		pageAnimation (offset, size, isSlideTo) {
			let duration = this.duration
			let late = offset
			let translate = this.translate
			if ( this.prevIndex >= 0 ) {
				animation.transition(this.getRef('yingbingSliderItem_' + this.prevIndex), {
					styles: {
						transform: isSlideTo ? `${translate}(${-size}px)` : `${translate}(${late - size}px)`
					},
					duration: isSlideTo ? 0 : duration,
					needLayout: true
				}, () => {
					if ( isSlideTo ) {
						animation.transition(this.getRef('yingbingSliderItem_' + this.prevIndex), {
							styles: {
								transform: `${translate}(${late - size}px)`
							},
							duration: duration,
							needLayout: true
						})
					}
				})
			}
			if ( this.nextIndex < this.count ) {
				animation.transition(this.getRef('yingbingSliderItem_' + this.nextIndex), {
					styles: {
						transform: isSlideTo ? `${translate}(${size}px)` : `${translate}(${late+size}px)`
					},
					duration: isSlideTo ? 0 : duration,
					needLayout: true
				}, () => {
					if ( isSlideTo ) {
						animation.transition(this.getRef('yingbingSliderItem_' + this.nextIndex), {
							styles: {
								transform: `${translate}(${late+size}px)`
							},
							duration: duration,
							needLayout: true
						})
					}
				})
			}
			animation.transition(this.getRef('yingbingSliderItem_' + this.currentIndex), {
				styles: {
					transform: isSlideTo ? `${translate}(0)` : `${translate}(${late}px)`
				},
				duration: isSlideTo ? 0 : duration,
				needLayout: true
			}, () => {
				if ( isSlideTo ) {
					animation.transition(this.getRef('yingbingSliderItem_' + this.currentIndex), {
						styles: {
							transform: `${translate}(${late}px)`
						},
						duration: duration,
						needLayout: true
					}, () => {
						if ( Math.abs(late) > 0 ) {
							this.handleSliderChange(this.direction == 'next' ? 1 : -1)
							this.$nextTick(function () {
								this.resetPageBinding()
							})
						} else {
							this.resetPageBinding()
						}
					})
				} else {
					if ( Math.abs(late) > 0 ) {
						this.handleSliderChange(this.direction == 'next' ? 1 : -1)
						this.$nextTick(function () {
							this.resetPageBinding()
						})
					} else {
						this.resetPageBinding()
					}
				}
			})
			// let props = []
			// if ( this.prevIndex >= 0 ) {
			// 	let prevItemTrans = isSlideTo ? -size : Binding.getComputedStyle(this.getEl('yingbingSliderItem_' + this.prevIndex))[translate]
			// 	props.push({
			// 		element: this.getEl('yingbingSliderItem_' + this.prevIndex),
			// 		property: 'transform.' + translate,
			// 		expression: `linear(t, ${prevItemTrans}, ${late - size - prevItemTrans}, ${duration})`
			// 	})
			// }
			// let currentItemTrans = isSlideTo ? 0 : Binding.getComputedStyle(this.getEl('yingbingSliderItem_' + this.currentIndex))[translate]
			// props.push({
			// 	element: this.getEl('yingbingSliderItem_' + this.currentIndex),
			// 	property: 'transform.' + translate,
			// 	expression: `linear(t, ${currentItemTrans}, ${late - currentItemTrans}, ${duration})`
			// })
			// if ( this.nextIndex < this.count ) {
			// 	let nextItemTrans = isSlideTo ? size : Binding.getComputedStyle(this.getEl('yingbingSliderItem_' + this.nextIndex))[translate]
			// 	props.push({
			// 		element: this.getEl('yingbingSliderItem_' + this.nextIndex),
			// 		property: 'transform.' + translate,
			// 		expression: `linear(t, ${nextItemTrans}, ${late + size - nextItemTrans}, ${duration})`
			// 	})
			// }
			// this.sliderAnimationBinding = Binding.bind({
			// 	eventType: 'timing',
			// 	exitExpression: 't>' + duration,
			// 	props: props
			// }, (e) => {
			// 	if (e.state == 'exit' && this.sliderAnimationBinding && e.t > duration) {
			// 		Binding.unbind({
			// 			token: this.sliderAnimationBinding.token,
			// 			eventType: 'timing'
			// 		})
			// 		this.sliderAnimationBinding = null
			// 		if ( Math.abs(late) > 0 ) {
			// 			this.handleSliderChange(this.direction == 'next' ? 1 : -1)
			// 			this.$nextTick(function () {
			// 				this.refreshIndex()
			// 				this.resetPageBinding()
			// 			})
			// 		} else {
			// 			this.resetPageBinding()
			// 		}
			// 	}
			// })
		},
		pulling () {
			let loadingType = this.loadingType
			let size = loadingType == 'pullup' ? this.pullupHeight : this.pulldownHeight
			let key = this.vertical ? 'y' : 'x'
			let translate = this.translate
			let props = [
				{
					element: this.getEl('yingbing_slider_' + loadingType),
					property: 'transform.' + translate,
					expression: loadingType == 'pullup' ? `abs(${key}) > ${size} ? 0 : ${key} + ${size}` : `abs(${key}) > ${size} ? 0 : ${key} - ${size}`
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_default'),
					property: 'opacity',
					expression: `abs(${key}) < ${size} ? 1 : 0`
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_ready'),
					property: 'opacity',
					expression: `abs(${key}) < ${size} ? 0 : 1`
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_loading'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_success'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_fail'),
					property: 'opacity',
					expression: '0+0'
				}
			]
			this.sliderBinding = Binding.bind({
				anchor: this.getEl('yingbingSlider'),
				eventType: 'pan',
				props: props
			}, (e) => {
				if ((e.state == 'end' || e.state == 'cancel') && this.sliderBinding) {
					Binding.unbind({
						token: this.sliderBinding.token,
						eventType: 'pan'
					})
					this.sliderBinding = null
					let deltaX = Binding.getComputedStyle(this.getEl('yingbing_slider_' + loadingType))[translate]
					if ( deltaX == 0 ) {
						this.loadingState = 'ready'
						this.pullingRefreshBindingx()
					} else {
						this.loadingState = 'default'
						this.resetPullingBindingx()
					}
				}
			})
		},
		resetPullingBindingx () {
			let loadingType = this.loadingType
			let translate = this.translate
			let size = loadingType == 'pullup' ? this.pullupHeight : this.pulldownHeight
			let trans = loadingType == 'pullup' ? size : -size
			let deltaX = Binding.getComputedStyle(this.getEl('yingbing_slider_' + loadingType))[translate]
			let duration = 300
			let props = [
				{
					element: this.getEl('yingbing_slider_' + loadingType),
					property: 'transform.' + translate,
					expression: `linear(t, ${deltaX}, ${trans}, ${duration})`
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_default'),
					property: 'opacity',
					expression: this.loadingState == 'default' ? '1+0' : '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_ready'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_loading'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_success'),
					property: 'opacity',
					expression: this.loadingState == 'success' ? '1+0' : '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_fail'),
					property: 'opacity',
					expression: this.loadingState == 'fail' ? '1+0' : '0+0'
				}
			]
			this.sliderAnimationBinding = Binding.bind({
				eventType: 'timing',
				exitExpression: 't>' + duration,
				props: props
			}, (e) => {
				if (e.state == 'exit' && this.sliderAnimationBinding && e.t > duration) {
					Binding.unbind({
						token: this.sliderAnimationBinding.token,
						eventType: 'timing'
					})
					this.sliderAnimationBinding = null
					this.loadingState = ''
					this.resetPageBinding()
				}
			})
		},
		pullingRefreshBindingx () {
			let loadingType = this.loadingType
			let duration = 1
			let props = [
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_default'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_ready'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_loading'),
					property: 'opacity',
					expression: '1+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_success'),
					property: 'opacity',
					expression: '0+0'
				},
				{
					element: this.getEl('yingbing_slider_' + loadingType + '_fail'),
					property: 'opacity',
					expression: '0+0'
				}
			]
			this.sliderAnimationBinding = Binding.bind({
				eventType: 'timing',
				exitExpression: 't>' + duration,
				props: props
			}, (e) => {
				if (e.state == 'exit' && this.sliderAnimationBinding && e.t > duration) {
					Binding.unbind({
						token: this.sliderAnimationBinding.token,
						eventType: 'timing'
					})
					this.sliderAnimationBinding = null
					this.pullingRefresh(loadingType)
				}
			})
		},
		getEl (selector) {
			const el = this.$refs[selector] && this.$refs[selector].length > 0 ? this.$refs[selector][0] : this.$refs[selector]
			if ( !el ) return null
			if (typeof el === 'string' || typeof el === 'number') return el;
			if (WXEnvironment) {
			    return el.ref;
			} else {
			    return el instanceof HTMLElement ? el : el.$el;
			}
		},
		getRef (selector) {
			return this.$refs[selector] ? this.$refs[selector].length > 0 ? this.$refs[selector][0] : this.$refs[selector] : null
		},
		resetPageBinding () {
			this.direction = ''
			this.touchTime = 0
			this.startX = 0
			this.startY = 0
			this.$nextTick(function () {
				this.isTouch = false
				this.disableTouch = false
			})
		}
	}
}