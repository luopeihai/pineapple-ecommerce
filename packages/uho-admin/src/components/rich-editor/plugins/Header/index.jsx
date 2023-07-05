import React from 'react'
import Icon from './../../components/Icon'

const toggleHeader = (value, level) => {
	const change = value.change()
	return change
		.setBlocks(hasHeader(value, level) ? 'paragraph' : `h${level}`)
		.setBlocks({ isVoid: false })
}

const hasHeader = (value, level) => {
	return value.blocks.some((node) => node.type === `h${level}`)
}

const ControlButton = ({ value, onChange }) => {
	// const levelList = [1, 2, 3]
	// return (
	// 	<span>
	// 		{levelList.map((level) => (
	// 			<Icon
	// 				key={level}
	// 				className={`${hasHeader(value, level) ? 'active' : ''}`}
	// 				name={`h${level}`}
	// 				onMouseDown={(e) => {
	// 					e.preventDefault()
	// 					onChange(toggleHeader(value, level))
	// 				}}
	// 				tip={`${level}级标题`}
	// 			/>
	// 		))}
	// 	</span>
	// )
	return (
		<Icon
			className={`${hasHeader(value, 1) ? 'active' : ''}`}
			name={`h1`}
			onMouseDown={(e) => {
				e.preventDefault()
				onChange(toggleHeader(value, 1))
			}}
			tip={'标题'}
		/>
	)
}

export default (options) => {
	return {
		changes: {
			toggleHeader
		},
		components: {
			ControlButton
		},
		helpers: {
			hasHeader
		},
		plugins: {
			renderNode: (props) => {
				const { children, node, attributes } = props
				// switch (node.type) {
				// 	case 'h1':
				// 		return <h1 {...attributes}>{children}</h1>
				// 	case 'h2':
				// 		return <h2 {...attributes}>{children}</h2>
				// 	case 'h3':
				// 		return <h3 {...attributes}>{children}</h3>
				// 	case 'h4':
				// 		return <h4 {...attributes}>{children}</h4>
				// 	case 'h5':
				// 		return <h5 {...attributes}>{children}</h5>
				// }
				switch (node.type) {
					case 'h1':
						return <h1 {...attributes}>{children}</h1>
					case 'h2':
						return <h1 {...attributes}>{children}</h1>
					case 'h3':
						return <h1 {...attributes}>{children}</h1>
					case 'h4':
						return <h1 {...attributes}>{children}</h1>
					case 'h5':
						return <h1 {...attributes}>{children}</h1>
				}
			}
		}
	}
}
