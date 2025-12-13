/**
 * StoryManager - Manages the story flow, state machine, and story content
 */
class StoryManager {
    constructor() {
        this.currentNode = 1;
        this.storyData = this.initializeStoryData();
    }

    /**
     * Initialize all story content
     */
    initializeStoryData() {
        return {
            node1: {
                id: 1,
                text: [
                    "棉棉最近很迷茫。",
                    "她想做很多事，却总是在心里想：",
                    "\"要是失败了怎么办？\""
                ],
                buttons: [
                    { text: "下一步", action: "next" }
                ],
                interaction: null
            },
            node2: {
                id: 2,
                text: [
                    "棉棉：\"你也觉得我想太多了，是吗？\"",
                    "风车快速旋转，像在说：",
                    "\"对！你终于发现问题了！\""
                ],
                buttons: [
                    { text: "下一步", action: "next" }
                ],
                interaction: "windmill"
            },
            node3: {
                id: 3,
                text: [
                    "棉棉明白了——",
                    "迷茫不是没有方向，",
                    "是想太多、做太少。"
                ],
                buttons: [
                    { text: "帮棉棉写下目标", action: "help" },
                    { text: "让她继续迷茫", action: "funny" }
                ],
                interaction: null
            },
            node4: {
                id: 4,
                text: [
                    "棉棉拿起纸和笔，",
                    "决定先做五分钟试试。"
                ],
                buttons: [
                    { text: "开始行动", action: "action" }
                ],
                interaction: "paper"
            },
            endings: {
                healing: {
                    text: [
                        "棉棉坚持了五分钟，",
                        "结果一口气做了十五分钟。",
                        "\"原来开始比想象中简单。\""
                    ]
                },
                funny: {
                    text: [
                        "做到一半棉棉睡着了。",
                        "风车\"啪！\"地转了一下，",
                        "像在鼓掌。"
                    ]
                },
                growth: {
                    text: [
                        "五分钟的小行动，",
                        "让棉棉慢慢走出迷茫。",
                        "\"方向是脑子决定的，",
                        "未来是脚走出来的。\""
                    ]
                },
                funnyChoice: {
                    text: [
                        "棉棉决定继续迷茫。",
                        "风车停止了旋转，",
                        "好像也累了。",
                        "（也许明天会好一点吧……）"
                    ]
                }
            }
        };
    }

    /**
     * Get current node data
     */
    getCurrentNode() {
        return this.storyData[`node${this.currentNode}`];
    }

    /**
     * Move to next node based on action
     */
    nextNode(action) {
        if (action === 'next') {
            this.currentNode++;
            return this.getCurrentNode();
        } else if (action === 'help') {
            this.currentNode = 4;
            return this.getCurrentNode();
        } else if (action === 'funny') {
            return { ending: 'funnyChoice' };
        } else if (action === 'action') {
            // Random ending selection
            const endings = ['healing', 'funny', 'growth'];
            const randomEnding = endings[Math.floor(Math.random() * endings.length)];
            return { ending: randomEnding };
        } else if (action === 'restart') {
            this.currentNode = 1;
            return this.getCurrentNode();
        }
    }

    /**
     * Get ending data
     */
    getEnding(endingName) {
        return this.storyData.endings[endingName];
    }

    /**
     * Reset story to beginning
     */
    reset() {
        this.currentNode = 1;
    }

    /**
     * Check if current node has interaction
     */
    hasInteraction() {
        const node = this.getCurrentNode();
        return node && node.interaction !== null;
    }

    /**
     * Get interaction type for current node
     */
    getInteractionType() {
        const node = this.getCurrentNode();
        return node ? node.interaction : null;
    }
}
