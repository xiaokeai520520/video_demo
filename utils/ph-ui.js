// ph-ui.js
// Pornhub 风格 UI 弹窗管理器
// 统一整合 toast、confirm、loading 等各种弹窗组件

/**
 * 统一的 Pornhub 风格 UI 管理器
 * 包含: toast, loading, confirm, alert, actionSheet, popup, notify 等功能
 */
const phUI = (function() {
	// 全局变量
	let loadingInstance = null;

	// 检查环境
	const isH5 = typeof window !== 'undefined' && typeof document !== 'undefined';
	const isUniapp = typeof uni !== 'undefined';

	/**
	 * Toast 提示
	 * @param {Object|String} options - 配置或提示文本
	 */
	function toast(options) {
		if (typeof options === 'string') {
			options = {
				title: options
			};
		}

		const defaultOptions = {
			title: options.title || '',
			icon: options.icon || 'none',
			image: options.image || '',
			duration: options.duration || 2000,
			mask: options.mask || false,
			position: options.position || 'center', // top, center, bottom
			complete: options.complete || null
		};

		if (isH5) {
			createToastH5(defaultOptions);
		} else if (isUniapp) {
			createToastUniapp(defaultOptions);
		}
	}

	/**
	 * 创建 H5 环境的 Toast
	 * @private
	 */
	function createToastH5(options) {
		// 检查是否已存在
		removeElement('.ph-toast-container');

		// 创建容器
		const container = document.createElement('div');
		container.className = `ph-toast-container ph-toast-${options.position}`;

		// 设置内容
		let iconHtml = '';
		if (options.icon && options.icon !== 'none') {
			iconHtml = `<div class="ph-toast-icon ph-toast-icon-${options.icon}"></div>`;
		}
		if (options.image) {
			iconHtml = `<div class="ph-toast-image"><img src="${options.image}" /></div>`;
		}

		container.innerHTML = `
      <div class="ph-toast">
        ${options.mask ? '<div class="ph-toast-mask"></div>' : ''}
        <div class="ph-toast-box">
          ${iconHtml}
          <div class="ph-toast-text">${options.title}</div>
        </div>
      </div>
    `;

		// 注入样式
		injectStyle();

		// 添加到页面
		document.body.appendChild(container);

		// 显示动画
		setTimeout(() => {
			container.classList.add('ph-toast-show');
		}, 10);

		// 自动关闭
		if (options.duration > 0) {
			setTimeout(() => {
				container.classList.remove('ph-toast-show');
				setTimeout(() => {
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}
					if (typeof options.complete === 'function') {
						options.complete();
					}
				}, 300);
			}, options.duration);
		}

		// 返回关闭方法
		return {
			close: () => {
				container.classList.remove('ph-toast-show');
				setTimeout(() => {
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}
				}, 300);
			}
		};
	}

	/**
	 * 创建 Uniapp 环境的 Toast (使用系统API，但覆盖样式)
	 * @private
	 */
	function createToastUniapp(options) {
		// 先注入样式覆盖系统样式
		injectUniappStyle();

		// 调用系统 toast
		uni.showToast({
			title: options.title,
			icon: options.icon,
			image: options.image,
			duration: options.duration,
			mask: options.mask,
			position: options.position === 'center' ? 'center' : options.position === 'top' ? 'top' :
				'bottom',
			complete: options.complete
		});
	}

	/**
	 * 隐藏 Toast
	 */
	function hideToast() {
		if (isH5) {
			const toast = document.querySelector('.ph-toast-container');
			if (toast) {
				toast.classList.remove('ph-toast-show');
				setTimeout(() => {
					if (toast.parentNode) {
						toast.parentNode.removeChild(toast);
					}
				}, 300);
			}
		} else if (isUniapp) {
			uni.hideToast();
		}
	}

	/**
	 * Loading 加载提示
	 * @param {Object|String} options - 配置或提示文本
	 */
	function loading(options) {
		if (typeof options === 'string') {
			options = {
				title: options
			};
		}

		const defaultOptions = {
			title: options.title || '加载中...',
			mask: options.mask !== undefined ? options.mask : true
		};

		if (isH5) {
			// 先关闭之前的
			hideLoading();

			// 创建新的
			loadingInstance = createLoadingH5(defaultOptions);
		} else if (isUniapp) {
			// 注入样式覆盖系统样式
			injectUniappStyle();

			// 使用系统 loading
			uni.showLoading({
				title: defaultOptions.title,
				mask: defaultOptions.mask
			});
		}
	}

	/**
	 * 创建 H5 环境的 Loading
	 * @private
	 */
	function createLoadingH5(options) {
		// 检查是否已存在
		removeElement('.ph-loading-container');

		// 创建容器
		const container = document.createElement('div');
		container.className = 'ph-loading-container';

		// 设置内容
		container.innerHTML = `
      <div class="ph-loading">
        ${options.mask ? '<div class="ph-loading-mask"></div>' : ''}
        <div class="ph-loading-box">
          <div class="ph-loading-spinner"></div>
          <div class="ph-loading-text">${options.title}</div>
        </div>
      </div>
    `;

		// 注入样式
		injectStyle();

		// 添加到页面
		document.body.appendChild(container);

		// 显示动画
		setTimeout(() => {
			container.classList.add('ph-loading-show');
		}, 10);

		// 返回关闭方法
		return {
			close: () => {
				container.classList.remove('ph-loading-show');
				setTimeout(() => {
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}
				}, 300);
			}
		};
	}

	/**
	 * 隐藏 Loading
	 */
	function hideLoading() {
		if (isH5) {
			if (loadingInstance) {
				loadingInstance.close();
				loadingInstance = null;
			}

			// 额外检查并移除所有可能残留的 loading 元素
			const loadingElements = document.querySelectorAll('.ph-loading-container');
			loadingElements.forEach(el => {
				if (el && el.parentNode) {
					el.classList.remove('ph-loading-show');
					setTimeout(() => {
						if (el.parentNode) {
							el.parentNode.removeChild(el);
						}
					}, 300);
				}
			});
		} else if (isUniapp) {
			uni.hideLoading();
		}
	}

	/**
	 * 确认对话框
	 * @param {Object|String} options - 配置或提示文本
	 * @returns {Promise} 返回Promise对象
	 */
	function confirm(options) {
		if (typeof options === 'string') {
			options = {
				content: options
			};
		}

		const defaultOptions = {
			title: options.title || '确认操作',
			content: options.content || '您确定要执行此操作吗？',
			showCancel: options.showCancel !== undefined ? options.showCancel : true,
			cancelText: options.cancelText || '取消',
			confirmText: options.confirmText || '确定',
			cancelColor: options.cancelColor || '#FFFFFF',
			confirmColor: options.confirmColor || '#FF9000',
			success: options.success || null,
			fail: options.fail || null,
			complete: options.complete || null,
			maskClosable: options.maskClosable !== undefined ? options.maskClosable : true
		};

		if (isH5) {
			return createConfirmH5(defaultOptions);
		} else if (isUniapp) {
			return createConfirmUniapp(defaultOptions);
		}

		// 默认返回Promise
		return Promise.resolve({
			confirm: true,
			cancel: false
		});
	}

	/**
	 * 创建 H5 环境的确认对话框
	 * @private
	 */
	function createConfirmH5(options) {
		return new Promise((resolve) => {
			// 移除已存在的确认框
			removeElement('.ph-confirm-container');

			// 创建容器
			const container = document.createElement('div');
			container.className = 'ph-confirm-container';

			// 设置HTML内容
			container.innerHTML = `
        <div class="ph-confirm-mask"></div>
        <div class="ph-confirm-dialog">
          <div class="ph-confirm-header">
            <div class="ph-confirm-title">${options.title}</div>
          </div>
          <div class="ph-confirm-content">
            <div class="ph-confirm-message">${options.content}</div>
          </div>
          <div class="ph-confirm-footer">
            ${options.showCancel ? `<button class="ph-confirm-btn ph-confirm-cancel">${options.cancelText}</button>` : ''}
            <button class="ph-confirm-btn ph-confirm-ok">${options.confirmText}</button>
          </div>
        </div>
      `;

			// 注入样式
			injectStyle();

			// 添加到页面
			document.body.appendChild(container);

			// 添加动画类
			setTimeout(() => {
				container.classList.add('ph-confirm-show');
			}, 10);

			// 按钮事件处理
			const cancelBtn = container.querySelector('.ph-confirm-cancel');
			const okBtn = container.querySelector('.ph-confirm-ok');
			const mask = container.querySelector('.ph-confirm-mask');

			// 关闭对话框
			const closeDialog = (result) => {
				container.classList.remove('ph-confirm-show');
				setTimeout(() => {
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}
				}, 300);

				if (result.confirm && options.success) {
					options.success(result);
				} else if (result.cancel && options.fail) {
					options.fail(result);
				}

				if (options.complete) {
					options.complete(result);
				}

				resolve(result);
			};

			// 确认按钮点击事件
			okBtn.addEventListener('click', () => {
				closeDialog({
					confirm: true,
					cancel: false
				});
			});

			// 取消按钮点击事件
			if (cancelBtn) {
				cancelBtn.addEventListener('click', () => {
					closeDialog({
						confirm: false,
						cancel: true
					});
				});
			}

			// 点击遮罩关闭（可选）
			if (options.maskClosable) {
				mask.addEventListener('click', () => {
					closeDialog({
						confirm: false,
						cancel: true
					});
				});
			}
		});
	}

	/**
	 * 创建 Uniapp 环境的确认对话框
	 * @private
	 */
	function createConfirmUniapp(options) {
		return new Promise((resolve) => {
			// 注入样式覆盖系统样式
			injectUniappStyle();

			// 使用系统 Modal
			uni.showModal({
				title: options.title,
				content: options.content,
				showCancel: options.showCancel,
				cancelText: options.cancelText,
				confirmText: options.confirmText,
				cancelColor: options.cancelColor,
				confirmColor: options.confirmColor,
				success: (res) => {
					if (options.success) {
						options.success(res);
					}
					resolve(res);
				},
				fail: (err) => {
					if (options.fail) {
						options.fail(err);
					}
					resolve({
						confirm: false,
						cancel: true
					});
				},
				complete: options.complete
			});
		});
	}

	/**
	 * 提示对话框 (只有确定按钮的对话框)
	 * @param {Object|String} options - 配置或提示文本
	 * @returns {Promise} 返回Promise对象
	 */
	function alert(options) {
		if (typeof options === 'string') {
			options = {
				content: options
			};
		}

		// 调用 confirm，但不显示取消按钮
		return confirm({
			...options,
			showCancel: false
		});
	}

	/**
	 * 底部操作菜单
	 * @param {Object} options - 配置
	 * @returns {Promise} 返回Promise对象
	 */
	function actionSheet(options) {
		const defaultOptions = {
			itemList: options.itemList || [],
			itemColor: options.itemColor || '#FFFFFF',
			success: options.success || null,
			fail: options.fail || null,
			complete: options.complete || null
		};

		if (isH5) {
			return createActionSheetH5(defaultOptions);
		} else if (isUniapp) {
			return createActionSheetUniapp(defaultOptions);
		}

		return Promise.resolve({
			tapIndex: 0
		});
	}

	/**
	 * 创建 H5 环境的操作菜单
	 * @private
	 */
	function createActionSheetH5(options) {
		return new Promise((resolve) => {
			// 移除已存在的
			removeElement('.ph-actionsheet-container');

			// 创建容器
			const container = document.createElement('div');
			container.className = 'ph-actionsheet-container';

			// 构建选项列表
			let itemsHtml = '';
			options.itemList.forEach((item, index) => {
				itemsHtml +=
					`<div class="ph-actionsheet-item" data-index="${index}">${item}</div>`;
			});

			// 设置HTML内容
			container.innerHTML = `
        <div class="ph-actionsheet-mask"></div>
        <div class="ph-actionsheet">
          <div class="ph-actionsheet-menu">
            ${itemsHtml}
          </div>
          <div class="ph-actionsheet-cancel">取消</div>
        </div>
      `;

			// 注入样式
			injectStyle();

			// 添加到页面
			document.body.appendChild(container);

			// 添加动画类
			setTimeout(() => {
				container.classList.add('ph-actionsheet-show');
			}, 10);

			// 关闭操作菜单
			const closeActionSheet = (result) => {
				container.classList.remove('ph-actionsheet-show');
				setTimeout(() => {
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}
				}, 300);

				if (!result.errMsg && options.success) {
					options.success(result);
				} else if (result.errMsg && options.fail) {
					options.fail(result);
				}

				if (options.complete) {
					options.complete(result);
				}

				resolve(result);
			};

			// 遮罩点击事件
			const mask = container.querySelector('.ph-actionsheet-mask');
			mask.addEventListener('click', () => {
				closeActionSheet({
					errMsg: 'actionSheet:fail cancel'
				});
			});

			// 取消按钮点击事件
			const cancelBtn = container.querySelector('.ph-actionsheet-cancel');
			cancelBtn.addEventListener('click', () => {
				closeActionSheet({
					errMsg: 'actionSheet:fail cancel'
				});
			});

			// 选项点击事件
			const items = container.querySelectorAll('.ph-actionsheet-item');
			items.forEach(item => {
				item.addEventListener('click', () => {
					const index = parseInt(item.getAttribute('data-index'));
					closeActionSheet({
						tapIndex: index
					});
				});
			});
		});
	}

	/**
	 * 创建 Uniapp 环境的操作菜单
	 * @private
	 */
	function createActionSheetUniapp(options) {
		return new Promise((resolve) => {
			// 注入样式覆盖系统样式
			injectUniappStyle();

			// 使用系统 ActionSheet
			uni.showActionSheet({
				itemList: options.itemList,
				itemColor: options.itemColor,
				success: (res) => {
					if (options.success) {
						options.success(res);
					}
					resolve(res);
				},
				fail: (err) => {
					if (options.fail) {
						options.fail(err);
					}
					resolve({
						errMsg: err.errMsg
					});
				},
				complete: options.complete
			});
		});
	}

	/**
	 * 通知消息
	 * @param {Object|String} options - 配置或提示文本
	 * @returns {Function} 返回关闭函数
	 */
	function notify(options) {
		if (typeof options === 'string') {
			options = {
				title: options
			};
		}

		const defaultOptions = {
			title: options.title || '',
			duration: options.duration || 3000,
			position: options.position || 'top', // top, bottom
			type: options.type || 'info', // info, success, warning, error
			showClose: options.showClose !== undefined ? options.showClose : false,
			onClick: options.onClick || null,
			onClose: options.onClose || null
		};

		if (isH5) {
			return createNotifyH5(defaultOptions);
		} else if (isUniapp) {
			// 在 uniapp 环境中，可以用自定义组件实现，这里简单用 toast 模拟
			toast({
				title: defaultOptions.title,
				position: defaultOptions.position,
				duration: defaultOptions.duration
			});

			return () => hideToast();
		}

		return () => {};
	}

	/**
	 * 创建 H5 环境的通知
	 * @private
	 */
	function createNotifyH5(options) {
		// 创建通知元素
		const notifyEl = document.createElement('div');
		notifyEl.className = `ph-notify ph-notify-${options.position} ph-notify-${options.type}`;

		// 设置通知内容
		notifyEl.innerHTML = `
      <div class="ph-notify-content">
        ${options.type !== 'info' ? `<div class="ph-notify-icon ph-notify-icon-${options.type}"></div>` : ''}
        <div class="ph-notify-title">${options.title}</div>
        ${options.showClose ? '<div class="ph-notify-close">×</div>' : ''}
      </div>
    `;

		// 注入样式
		injectStyle();

		// 添加到页面
		document.body.appendChild(notifyEl);

		// 显示通知
		setTimeout(() => {
			notifyEl.classList.add('ph-notify-show');
		}, 10);

		// 点击事件
		notifyEl.addEventListener('click', (e) => {
			if (e.target.classList.contains('ph-notify-close')) {
				// 关闭按钮点击
				closeNotify();
				if (options.onClose) options.onClose();
			} else {
				// 整体通知点击
				if (options.onClick) options.onClick();
			}
		});

		// 关闭通知
		const closeNotify = () => {
			notifyEl.classList.remove('ph-notify-show');
			setTimeout(() => {
				if (notifyEl.parentNode) {
					notifyEl.parentNode.removeChild(notifyEl);
				}
			}, 300);
		};

		// 自动关闭
		if (options.duration > 0) {
			setTimeout(closeNotify, options.duration);
		}

		// 返回关闭函数
		return closeNotify;
	}

	/**
	 * 移除指定选择器的元素
	 * @private
	 */
	function removeElement(selector) {
		if (!isH5) return;

		const element = document.querySelector(selector);
		if (element && element.parentNode) {
			element.parentNode.removeChild(element);
		}
	}

	/**
	 * 注入样式
	 * @private
	 */
	function injectStyle() {
		if (!isH5) return;

		// 检查是否已经注入过
		if (document.getElementById('ph-ui-style')) return;

		// 创建样式元素
		const style = document.createElement('style');
		style.id = 'ph-ui-style';
		style.type = 'text/css';
		style.innerHTML = `
      /* Pornhub 风格 UI 样式 */
      :root {
        --ph-black: #000000;
        --ph-dark: #121212;
        --ph-orange: #FF9000;
        --ph-white: #FFFFFF;
        --ph-grey: #282828;
        --ph-light-grey: #383838;
      }      
      /* Toast 样式 */
      .ph-toast-container {
        position: fixed;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        width: 100%;
      }
      
      .ph-toast-container.ph-toast-top {
        top: 60px;
      }
      
      .ph-toast-container.ph-toast-center {
        top: 50%;
        transform: translateY(-50%);
      }
      
      .ph-toast-container.ph-toast-bottom {
        bottom: 60px;
      }
      
      .ph-toast-show {
        opacity: 1;
        pointer-events: auto;
      }
      
      .ph-toast-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
      }
      
      .ph-toast-box {
        background-color: rgba(18, 18, 18, 0.9);
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 80%;
        border: 1px solid var(--ph-grey);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
      
      .ph-toast-icon {
        width: 40px;
        height: 40px;
        margin-bottom: 8px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .ph-toast-icon-success {
        background-color: rgba(255, 144, 0, 0.1);
        position: relative;
      }
      
      .ph-toast-icon-success:before {
        content: '';
        position: absolute;
        width: 20px;
        height: 10px;
        border-left: 3px solid var(--ph-orange);
        border-bottom: 3px solid var(--ph-orange);
        transform: rotate(-45deg);
        top: 13px;
        left: 10px;
      }
      
      .ph-toast-icon-loading {
        animation: ph-spin 1s linear infinite;
        border: 3px solid rgba(255, 144, 0, 0.1);
        border-top-color: var(--ph-orange);
      }
      
      .ph-toast-icon-error {
        background-color: rgba(255, 68, 68, 0.1);
        position: relative;
      }
      
      .ph-toast-icon-error:before,
      .ph-toast-icon-error:after {
        content: '';
        position: absolute;
        width: 20px;
        height: 3px;
        background-color: #FF4444;
        top: 18px;
        left: 10px;
      }
      
      .ph-toast-icon-error:before {
        transform: rotate(45deg);
      }
      
      .ph-toast-icon-error:after {
        transform: rotate(-45deg);
      }
      
      .ph-toast-text {
        color: var(--ph-white);
        font-size: 16px;
        text-align: center;
        padding: 0 10px;
        word-break: break-word;
      }
      
      @keyframes ph-spin {
        to { transform: rotate(360deg); }
      }
      
      /* Loading 样式 */
      .ph-loading-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      
      .ph-loading-show {
        opacity: 1;
        pointer-events: auto;
      }
      
      .ph-loading-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      .ph-loading-box {
        background-color: rgba(18, 18, 18, 0.9);
        padding: 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 120px;
        border: 1px solid var(--ph-grey);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
      
      .ph-loading-spinner {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid rgba(255, 144, 0, 0.1);
        border-top-color: var(--ph-orange);
        animation: ph-spin 1s linear infinite;
        margin-bottom: 10px;
      }
      
      .ph-loading-text {
		color: var(--ph-white) !important; /* 使用 !important 确保覆盖其他样式 */
		font-size: 14px;
		font-weight: normal;
      }
      
      /* 确认对话框样式 */
      .ph-confirm-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      
      .ph-confirm-show {
        opacity: 1;
        pointer-events: auto;
      }
      
      .ph-confirm-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(3px);
      }
      
      .ph-confirm-dialog {
        position: relative;
        width: 80%;
        max-width: 320px;
        background-color: var(--ph-dark);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--ph-grey);
        animation: ph-dialog-zoom-in 0.3s forwards;
      }
      
      @keyframes ph-dialog-zoom-in {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      .ph-confirm-header {
        padding: 15px;
        border-bottom: 1px solid var(--ph-grey);
        text-align: center;
      }
      
      .ph-confirm-title {
        font-size: 18px;
        font-weight: bold;
        color: var(--ph-orange);
      }
      
      .ph-confirm-content {
        padding: 20px 15px;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .ph-confirm-message {
        font-size: 16px;
        color: var(--ph-white);
        text-align: center;
        line-height: 1.5;
      }
      
      .ph-confirm-footer {
        display: flex;
        border-top: 1px solid var(--ph-grey);
        overflow: hidden;
      }
      
      .ph-confirm-btn {
        flex: 1;
        padding: 12px 0;
        font-size: 16px;
        text-align: center;
        border: none;
        background: none;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .ph-confirm-cancel {
        color: var(--ph-white);
        background-color: var(--ph-grey);
      }
      
      .ph-confirm-cancel:active {
        background-color: var(--ph-light-grey);
      }
      
      .ph-confirm-ok {
        color: var(--ph-black);
        background-color: var(--ph-orange);
        font-weight: bold;
      }
      
      .ph-confirm-ok:active {
        background-color: #E08000;
      }
      
      /* 操作菜单样式 */
      .ph-actionsheet-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      
      .ph-actionsheet-show {
        opacity: 1;
        pointer-events: auto;
      }
      
      .ph-actionsheet-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
      }
      
      .ph-actionsheet {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--ph-dark);
        border-radius: 12px 12px 0 0;
        border-top: 1px solid var(--ph-grey);
        overflow: hidden;
        transform: translateY(100%);
        transition: transform 0.3s;
      }
      
      .ph-actionsheet-show .ph-actionsheet {
        transform: translateY(0);
      }
      
      .ph-actionsheet-menu {
        max-height: 60vh;
        overflow-y: auto;
      }
      
      .ph-actionsheet-item {
        padding: 15px;
        text-align: center;
        font-size: 16px;
        color: var(--ph-white);
        border-bottom: 1px solid var(--ph-grey);
        transition: background-color 0.2s;
      }
      
      .ph-actionsheet-item:active {
        background-color: var(--ph-light-grey);
      }
      
      .ph-actionsheet-cancel {
        padding: 15px;
        text-align: center;
        font-size: 16px;
        color: var(--ph-orange);
        font-weight: bold;
        background-color: var(--ph-dark);
        margin-top: 8px;
        border-top: 1px solid var(--ph-grey);
      }
      
      .ph-actionsheet-cancel:active {
        background-color: var(--ph-light-grey);
      }
      
      /* 通知样式 */
      .ph-notify {
        position: fixed;
        z-index: 9999;
        padding: 12px 20px;
        background-color: var(--ph-dark);
        border: 1px solid var(--ph-grey);
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: auto;
        max-width: 90%;
        width: 340px;
      }
      
      .ph-notify-show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .ph-notify-top {
        top: 20px;
        right: 20px;
      }
      
      .ph-notify-bottom {
        bottom: 20px;
        right: 20px;
      }
      
      .ph-notify-content {
        display: flex;
        align-items: center;
      }
      
      .ph-notify-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        position: relative;
      }
      
      .ph-notify-icon-success:before {
        content: '';
        position: absolute;
        width: 12px;
        height: 6px;
        border-left: 2px solid var(--ph-orange);
        border-bottom: 2px solid var(--ph-orange);
        transform: rotate(-45deg);
        top: 6px;
        left: 4px;
      }
      
      .ph-notify-icon-warning:before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 16px solid #FF9900;
        top: 0;
        left: 0;
      }
      
      .ph-notify-icon-error:before,
      .ph-notify-icon-error:after {
        content: '';
        position: absolute;
        width: 14px;
        height: 2px;
        background-color: #FF4444;
        top: 9px;
        left: 3px;
      }
      
      .ph-notify-icon-error:before {
        transform: rotate(45deg);
      }
      
      .ph-notify-icon-error:after {
        transform: rotate(-45deg);
      }
      
      .ph-notify-title {
        color: var(--ph-white);
        font-size: 14px;
        flex: 1;
      }
      
      .ph-notify-close {
        width: 20px;
        height: 20px;
        color: var(--ph-white);
        font-size: 16px;
        text-align: center;
        line-height: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
      
      .ph-notify-success {
        border-left: 4px solid var(--ph-orange);
      }
      
      .ph-notify-warning {
        border-left: 4px solid #FF9900;
      }
      
      .ph-notify-error {
        border-left: 4px solid #FF4444;
      }
    `;

		document.head.appendChild(style);
	}

	/**
	 * 注入 Uniapp 样式
	 * @private
	 */
	function injectUniappStyle() {
		if (!isUniapp || !isH5) return;

		// 检查是否已经注入过
		if (document.getElementById('ph-uniapp-style')) return;

		// 创建样式元素
		const style = document.createElement('style');
		style.id = 'ph-uniapp-style';
		style.type = 'text/css';
		style.innerHTML = `
      /* 覆盖 Uniapp 组件样式 */
      .uni-mask {
        background-color: rgba(0, 0, 0, 0.75) !important;
      }
	  .uni-loading .uni-loading-text {
		color: #FFFFFF !important;
	  }
      
      .uni-toast {
        background-color: rgba(18, 18, 18, 0.9) !important;
        border: 1px solid #282828 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
      }
      
      .uni-toast__text {
        color: #FFFFFF !important;
      }
      
      .uni-modal__container {
        background-color: #121212 !important;
        border: 1px solid #282828 !important;
        overflow: hidden !important;
        border-radius: 8px !important;
      }
      
      .uni-modal__hd {
        border-bottom: 1px solid #282828 !important;
      }
      
      .uni-modal__title {
        color: #FF9000 !important;
        font-weight: bold !important;
      }
      
      .uni-modal__bd {
        color: #FFFFFF !important;
      }
      
      .uni-modal__ft {
        border-top: 1px solid #282828 !important;
      }
      
      .uni-modal__btn {
        font-size: 16px !important;
      }
      
      .uni-modal__btn_primary {
        color: #000000 !important;
        background-color: #FF9000 !important;
        font-weight: bold !important;
      }
      
      .uni-modal__btn_default {
        color: #FFFFFF !important;
        background-color: #282828 !important;
      }
      
      .uni-actionsheet {
        background-color: #121212 !important;
        border-top: 1px solid #282828 !important;
      }
      
      .uni-actionsheet__title {
        color: #FF9000 !important;
      }
      
      .uni-actionsheet__menu {
        max-height: 60vh !important;
      }
      
      .uni-actionsheet__cell {
        color: #FFFFFF !important;
        border-bottom: 1px solid #282828 !important;
      }
      
      .uni-actionsheet__cell:active {
        background-color: #383838 !important;
      }
      
      .uni-actionsheet__cancel {
        color: #FF9000 !important;
        font-weight: bold !important;
        margin-top: 8px !important;
        background-color: #121212 !important;
      }
    `;

		document.head.appendChild(style);
	}

	/**
	 * 重写 Uniapp 原生方法
	 */
	function overrideUniMethods() {
		if (!isUniapp) return;

		// 保存原始方法
		const originalShowToast = uni.showToast;
		const originalShowLoading = uni.showLoading;
		const originalHideLoading = uni.hideLoading;
		const originalShowModal = uni.showModal;
		const originalShowActionSheet = uni.showActionSheet;

		// 替换为自定义方法
		uni.showToast = function(options) {
			return toast(options);
		};

		uni.showLoading = function(options) {
			return loading(options);
		};
		 // 替换 hideLoading
		  uni.hideLoading = function() {
			// 使用 phUI 的 hideLoading 方法
			return hideLoading();
		  };

		uni.showModal = function(options) {
			return confirm(options);
		};

		uni.showActionSheet = function(options) {
			return actionSheet(options);
		};

		// 提供恢复原始方法的功能
		return function restoreOriginalMethods() {
			uni.showToast = originalShowToast;
			uni.showLoading = originalShowLoading;
			uni.showModal = originalShowModal;
			uni.showActionSheet = originalShowActionSheet;
		};
	}

	// 初始化
	function init() {
		if (isH5) {
			injectStyle();
		}

		if (isUniapp && isH5) {
			injectUniappStyle();
		}
	}

	// 初始化调用
	init();

	// 导出方法
	return {
		toast,
		hideToast,
		loading,
		hideLoading,
		confirm,
		alert,
		actionSheet,
		notify,
		overrideUniMethods
	};
})();

// 导出模块
export default phUI;