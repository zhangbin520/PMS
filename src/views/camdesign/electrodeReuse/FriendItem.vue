<template>
	<div class="friend-item" :class="active ? 'active' : ''" @contextmenu.prevent="showRightMenu($event)">
		<div class="friend-avatar">
			
		</div>
		<div class="friend-info">
		<div class="friend-row">
			<div class="friend-cell friend-name">{{ friend.electrodeProdOrderNo }}</div>
			<div class="friend-cell friend-no">{{ friend.electrodeNo }}</div>
			<div class="friend-cell friend-rfid">{{ friend.rfid }}</div>
			<div class="friend-cell friend-toor">{{ friend.toor }}</div>
			<div class="friend-online">
			<i class="el-icon-monitor online" v-show="friend.onlineWeb" title="电脑设备在线">
				<span class="online-icon"></span>
			</i>
			<i class="el-icon-mobile-phone online" v-show="friend.onlineApp" title="移动设备在线">
				<span class="online-icon"></span>
			</i>
			</div>
		</div>
		</div>
		
		<slot></slot>
	</div>
</template>

<script>


export default {
	name: "frinedItem",
	components: {
		
	},
	data() {
		return {
			menuItems: [{
				key: 'CHAT',
				name: '发送消息',
				icon: 'el-icon-chat-dot-round'
			}, {
				key: 'DELETE',
				name: '删除好友',
				icon: 'el-icon-delete'
			}]
		}
	},
	methods: {
		showRightMenu(e) {
			if (this.menu) {
				this.$refs.rightMenu.open(e, this.menuItems);
			}
		},
		onSelectMenu(item) {
			this.$emit(item.key.toLowerCase(), this.msgInfo);
		}
	},
	props: {
		active: {
			type: Boolean
		},
		friend: {
			type: Object
		},
		menu: {
			type: Boolean,
			default: true
		}
	}

}
</script>

<style scope lang="scss">
.friend-item {
  height: 50px;
  display: flex;
  position: relative;
  align-items: center;
  white-space: nowrap;
  border-radius: 10px;
  margin: 0 3px;
  padding: 5px 8px;
  cursor: pointer;

  &:hover {
    background-color: var(--im-background-active);
  }

  &.active {
    background-color: var(--im-background-active-dark);
  }

  .friend-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .friend-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    text-align: left;
    
    .friend-row {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px; /* 设置单元格之间的间距 */
    }

    .friend-cell {
      font-size: 14px; /* 字体稍微大一点，可以根据需要调整 */
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      
      &.friend-name {
        min-width: 120px; /* 设置最小宽度 */
        flex: 1; /* 允许扩展 */
      }
      
      &.friend-no {
        min-width: 100px;
        flex: 1;
      }
      
      &.friend-rfid {
        min-width: 120px;
        flex: 1;
      }
      
      &.friend-toor {
        min-width: 80px;
        flex: 1;
      }
    }

    .friend-online {
      margin-left: auto; /* 将在线状态推到最右边 */
      flex-shrink: 0;
      
      .online {
        font-weight: bold;
        padding-right: 2px;
        font-size: 16px;
        position: relative;
      }

      .online-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 6px;
        height: 6px;
        background: limegreen;
        border-radius: 50%;
        border: 1px solid white;
      }
    }
  }
}
</style>
