
import { getBoxValue } from '../../Components/utils/functions';
import { getBorderCSS, getColorsCSS, getTypoCSS } from '../../Components/utils/getCSS';
import { ratioCheck } from './utils/functions';

const Style = ({ attributes, clientId }) => {
	const { columnGap, rowGap, coverImage, imgBorder, loadMoreBtnTypo, loadMoreBtnColors, loadMoreBtnBorder, loadMoreBtnPadding } = attributes;

	const mainSl = `#BPGPBBlockDirectory-${clientId}`;
	const directorySl = `${mainSl} .layoutSection`;

	return <style dangerouslySetInnerHTML={{
		__html: `

		${getTypoCSS('', loadMoreBtnTypo)?.googleFontLink}
		${getTypoCSS(`${mainSl}  .loadMoreBtn`, loadMoreBtnTypo)?.styles}
		 
		${directorySl}{
			grid-gap: ${rowGap} ${columnGap};  
		} 

		${directorySl} .imgArea .img img {
			${getBorderCSS(imgBorder)};
		}

		${directorySl} .imgArea .img {
			padding-top: ${ratioCheck(coverImage?.ratio)}%;
		}

		${mainSl}  .loadMoreBtn {
			${getColorsCSS(loadMoreBtnColors)};
			${getBorderCSS(loadMoreBtnBorder)};
			padding:${getBoxValue(loadMoreBtnPadding)}
		}

	`}} />;
}
export default Style;