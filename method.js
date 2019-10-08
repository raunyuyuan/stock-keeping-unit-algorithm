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
const getClickValueLay = (mapDomData, isClick, currentClickLay) => {
    const clickedValues = []
    const unClickLay = []
    mapDomData.forEach((item, lay) => {
        // 如果是取消的话，就需要将之前的组合给计算出来，
        if (!isClick) {
            item.forEach(item => {
                if (item.clicked) clickedValues.push({value: item.value, idx: lay});
            })
        // 不是取消记录没有点过的属性行
        } else if (lay !== Number(currentClickLay)) {
            unClickLay.push(lay);
        }
    })
    return {clickedValues, unClickLay}
}

const switchDisabled = (isClick, clickedValues, mapDomData, currentClickLay, unClickLay, currentClick, mcl) => {
    // 是选择的时候重新遍历所有没有选择的属性行 查找与现在的组合一起是否存在 存在为true
    if (isClick && clickedValues.length !== mapDomData.length) {
        unClickLay.forEach(lay => {
            let a = [{value: currentClick.value, idx: currentClickLay}]
            let addAttr = {value: '', idx: lay}
            a.push(addAttr)
            // 通过idx排序后 将其他行属性放入所在的位置
            a = a.sort((a, b) => a.idx - b.idx)
            mapDomData[lay].forEach((item, idx) => {
                addAttr.value = item.value
                const skuGroup = a.map(item => item.value).join('-')
                item.disabled = !Boolean(mcl[skuGroup])
            })
            
        });
    }
    /** 
     * 取消的时候需要判断已选择的行的非选属性的状态
     * 
    */
    if (!isClick && clickedValues.length !== 0) {
        mapDomData[currentClickLay].forEach((item) => {
            let a = [...clickedValues]
            a.push({value: item.value, idx: currentClickLay})
            const skuGroup =  a.sort((a, b) => a.idx - b.idx).map(item => item.value).join('-')
            item.disabled = !Boolean(mcl[skuGroup])
        });
    }
    // 取消全部选择
    if (clickedValues.length === 0 && !isClick) {
        mapDomData.forEach(list => {
            list.forEach(item => item.disabled = !Boolean(mcl[item.value]))
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