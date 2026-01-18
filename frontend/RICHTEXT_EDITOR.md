# 富文本编辑器使用说明

## 功能特性

RichTextEditor 是基于 Tiptap 的富文本编辑器组件，支持以下功能：

### 文本格式
- **粗体** (Ctrl/Cmd + B)
- *斜体* (Ctrl/Cmd + I)
- ~~删除线~~ (Ctrl/Cmd + Shift + S)
- <u>下划线</u> (Ctrl/Cmd + U)

### 标题
- Heading 1 (Ctrl/Cmd + Alt + 1)
- Heading 2 (Ctrl/Cmd + Alt + 2)
- Heading 3 (Ctrl/Cmd + Alt + 3)

### 列表
- 无序列表 (Ctrl/Cmd + Shift + 8)
- 有序列表 (Ctrl/Cmd + Shift + 9)

### 对齐
- 左对齐
- 居中对齐
- 右对齐

## 使用方法

### 在创建任务中

```tsx
<RichTextEditor
  content={description}
  onChange={setDescription}
  placeholder="添加任务描述（支持富文本编辑）"
/>
```

### 在编辑任务中

```tsx
<RichTextEditor
  content={editingDescription}
  onChange={setEditingDescription}
  placeholder="任务描述"
/>
```

### 只读模式

```tsx
<RichTextEditor
  content={task.description}
  onChange={() => {}}
  editable={false}
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `string` | - | 编辑器内容（HTML 格式） |
| `onChange` | `(content: string) => void` | - | 内容变化回调函数 |
| `placeholder` | `string` | `"输入任务描述..."` | 占位符文本 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `className` | `string` | - | 自定义类名 |

## 数据格式

编辑器使用 HTML 格式存储和传输数据：

```json
{
  "title": "任务标题",
  "description": "<p>这是一段<strong>粗体</strong>文本</p>",
  "completed": false
}
```

### 常见 HTML 格式示例

```html
<!-- 粗体 -->
<strong>粗体文本</strong>

<!-- 斜体 -->
<em>斜体文本</em>

<!-- 标题 -->
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>

<!-- 无序列表 -->
<ul>
  <li>列表项 1</li>
  <li>列表项 2</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>第一项</li>
  <li>第二项</li>
</ol>

<!-- 对齐 -->
<p style="text-align: center;">居中文本</p>
<p style="text-align: right;">右对齐文本</p>
```

## 后端支持

后端无需修改，因为：

1. **数据库**: SQLite 的 `TEXT` 类型可以存储任意长度的字符串，包括 HTML
2. **模型**: SQLAlchemy 的 `String` 字段自动处理字符串数据
3. **API**: Pydantic 的 `str` 类型可以接收和返回 HTML 字符串

### 数据库字段

```python
class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)  # 自动支持 HTML
    completed = Column(Boolean, default=False)
```

## 快捷键

| 功能 | 快捷键 (Windows/Linux) | 快捷键 (Mac) |
|------|---------------------|-------------|
| 粗体 | Ctrl + B | Cmd + B |
| 斜体 | Ctrl + I | Cmd + I |
| 删除线 | Ctrl + Shift + S | Cmd + Shift + S |
| 下划线 | Ctrl + U | Cmd + U |
| 标题 1 | Ctrl + Alt + 1 | Cmd + Alt + 1 |
| 标题 2 | Ctrl + Alt + 2 | Cmd + Alt + 2 |
| 标题 3 | Ctrl + Alt + 3 | Cmd + Alt + 3 |
| 无序列表 | Ctrl + Shift + 8 | Cmd + Shift + 8 |
| 有序列表 | Ctrl + Shift + 9 | Cmd + Shift + 9 |

## 自定义样式

编辑器使用 Tailwind CSS 的 `prose` 类进行样式渲染，可以通过 CSS 自定义：

```css
.ProseMirror h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
```

## 注意事项

1. **安全性**: 编辑器会过滤 HTML 标签，只保留安全的内容
2. **XSS 防护**: 建议在后端对 HTML 进行清理（如果需要）
3. **图片**: 当前版本不支持插入图片
4. **视频**: 当前版本不支持插入视频
