import React from 'react'
import Icon from '../../components/Icon'
import HtmlSerializer from '../../utils/html'

export default ({ value, onChange }) => (
	<Icon
		name="window-maximize"
		tip="预览"
		onClick={(e) => {
			showPreview(value)
		}}
	/>
)
