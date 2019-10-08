// 初始化sku最短路径表
const getSkuMcl = (skuData) => {
    let existSkus = {}
    skuData.forEach(item => {
        let skuGroup = item.skuId.split('')
        if (Number(item.stock) === 0) return
        let existSku = skuGroup.map((id, idx) => {
            return skuGroups[idx].list.find(item => Number(item.id) === Number(id)).value
        })
        // 求幂集 后一项依赖前一项的组合
        let ps = ['']
        existSku.forEach((skuAttr, i) => {
            ps.forEach((item1, j) => {
                const prevItem = ps[j]
                const exitKey = prevItem + (prevItem === '' ? '': '-') + skuAttr
                ps.push(exitKey)
                if (!existSkus[exitKey]) {
                    existSkus[exitKey] = [
                        item
                    ]
                } else {
                    existSkus[exitKey].push(item)
                }
                
            })
        })
    })
    return existSkus
}


// 生成对应dom的数据
function getMapDomData (skuGroups, mcl){
    const mapDomData = []
    skuGroups.forEach((item, idx) => {
        mapDomData.push([])
        item.list.forEach((item, idx1) => {
            mapDomData[idx].push({value: item.value, clicked: false, disabled: !Boolean(mcl[item.value])})
        })
    })
    return {mapDomData}
}


// 点击后重新设置dom样式
const setDomStyle = (doms, mapDomData) => {
    doms.forEach((itemList, lay) => {
        itemList.forEach((btn, btnIdx) => {
            if(mapDomData[lay][btnIdx].disabled) {
                btn.attr('disabled', 'true')
            } else {
                btn.removeAttr('disabled')
            }
            if(mapDomData[lay][btnIdx].clicked) {
                btn.addClass('clicked')
            } else {
                btn.removeClass('clicked')
            }
        })
    })
}

// 生成最初dom
const initDom = ($box, mapDomData) => {
    let doms = []
    skuGroups.forEach((item, idx) => {
        const $dom =  $(
            `<div class='attr-item'>
                ${item.name}:
            </div>`
        );
        let len = doms.push([])
        item.list.forEach((item1, idx1)=> {
            let $listItem = $(`
                <input
                    type="button"
                    class="sku"
                    ${mapDomData[idx][idx1].disabled ? 'disabled' : ''}
                    data-idx=${idx}
                    data-idx1="${idx1}"
                    value="${item1.value}"
                    onclick="clickSku(event)"
                />
            `)
            doms[len - 1].push($listItem)
            $listItem.appendTo($dom)
        })
        $dom.appendTo($box)
    })
    return doms
}

// 获得未点击的行索引，以及点击过的值，根据isClick做不同的操作
const getClickValues = (mapDomData) => {
    const clickedValues = []
    const unClickLay = []
    mapDomData.forEach((item, lay) => {
        let click = false
        item.forEach(item => {
            if (item.clicked) {
                click = true
                clickedValues.push({value: item.value, idx: lay});
            }
        })
        if (!click) unClickLay.push(lay);
    })
    return {clickedValues, unClickLay}
}

const switchDisabled = (isClick, clickedValues, mapDomData, currentClickLay, currentClick, mcl, unClickLay) => {
    // 选择的时候重新遍历所有除自己以外的属性行 查找与现在的组合一起是否存在 存在为true
    if (isClick) {
        // 组合一起后与没有点击过的行每一项进行比较
        unClickLay.forEach((lay) => {
            mapDomData[lay].forEach(item => {
                // 去掉已经不在的
                if (item.disable) return
                let a = [...clickedValues, {value: item.value, idx: lay}]
                a.sort((a, b) => a.idx - b.idx)
                const skuGroup = a.map(item => item.value).join('-')
                item.disabled = !(skuGroup in mcl)
            })
        });
        // 与已经选择所有行互相进行组合
        clickedValues.forEach(clickedBtn => {
            if (clickedBtn.idx !== currentClickLay) {
                mapDomData[clickedBtn.idx].forEach(btn => {
                    if (btn.disabled) return
                    const a = [btn.value]
                    const method = currentClickLay > clickedBtn.idx ? 'push' : 'unshift'
                    a[method](currentClick.value)
                    const skuGroup = a.join('-')
                    btn.disabled = !(skuGroup in mcl)
                })
                
            }
        })
    }
     /** 
      * TODO
     * 取消的时候需要返回以前的状态
     * 最好做制表 维护一张历史记录的表
     * 制表其实也存在一个问题,选择1 => 2 => 3，突然取消2表里面没有1，3组合的记录
     * 方案：三种
     * 1. 制表无法实现
     * 2. init整张数据，模拟click 2次，这个结果绝对正确，需要考虑复杂度
     * 3. 如果不模拟click，首先当前行需要与其他已经选择行组合做比较, 当前行正确
     *        问题在于如何恢复其他已选择行受到当前行的影响
     *         让其他行之间互相比较，不在表中的不做组合，已经disable的不恢复，这里需要将n * n的全部init一次。。（等于去模拟了一次click）
    */
    if (!isClick && clickedValues.length !== 0) {
        // 将没选的行和已选的组合一下
        unClickLay.forEach(lay => {
            mapDomData[lay].forEach((item) => {
                // 去掉已经不在的
                if (!(item.value in mcl)) return
                let a = [...clickedValues, {value: item.value, idx: currentClickLay}]
                a.sort((a, b) => a.idx - b.idx)
                const skuGroup = a.map(item => item.value).join('-')
                item.disabled = !(skuGroup in mcl)
            });
        })
        // 只剩一行时将这一行reinit
        if (clickedValues.length === 1) {
            mapDomData[clickedValues[0].idx].forEach(btn => {
                btn.disabled = !(btn.value in mcl)
            })
        // 将当前行点击过的行互相判断一下
        } else {
            mapDomData.forEach((item, lay) => {
                if (clickedValues.every(item => item.idx !== lay)) return
                clickedValues.forEach(clickedBtn => {
                    if (lay === clickedBtn.idx) return
                    item.forEach(btn => {
                        if (!(btn.value in mcl)) return
                        let a = [clickedBtn.value]
                        const method = lay > clickedBtn.idx ? 'push' : 'unshift'
                        a[method](btn.value)
                        const skuGroup = a.join('-')
                        console.log(skuGroup, 2)
                        btn.disabled = !(skuGroup in mcl)
                    })
                })
            })
        }
    }
    // 取消全部选择
    if (clickedValues.length === 0 && !isClick) {
        mapDomData.forEach(list => {
            list.forEach(item => item.disabled = !(item.value in mcl))
        })
    }
}

const switchClick =(currentClickLay, currentClickBtnIdx, mapDomData) => {
    mapDomData[currentClickLay].forEach((item, btnIdx) => {
        if (btnIdx === currentClickBtnIdx) {
            item.clicked = !item.clicked
        } else {
            item.clicked = false
        }
    })
}