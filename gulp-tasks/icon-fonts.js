import gulp from "gulp";
import fs from 'fs';

const facesSrcPath = `./src/icon-fonts/style.css`;
const facesDestPath = `./src/styles/icon-fonts.scss`;
const fontsSrcPath = `./src/icon-fonts/fonts/**`;
const fontsDestPath = `./public/assets/fonts`;

export const processFontFaces = (cb) => {
	if (!fs.existsSync(facesSrcPath)) {
		console.log("Icon font faces styles was not found by the path");
		return cb();
	}
	if (fs.existsSync(facesDestPath)) {
		if (process.argv.includes('--rewrite')) {
			try {
				fs.unlinkSync(facesDestPath);
				console.log("Current icon-fonts.scss has been removed");
			} catch (err) {
				console.error(`Error encountered while icon-fonts.scss removal: ${err}`);
			}
		} else {
			console.log("Файл icon-fonts.scss уже существует. Для обновления файла нужно его удалить или применить флаг --rewrite!");
			return cb();
		}
	}
	let facesSrc, facesDestFile;
	try {
		facesSrc = fs.readFileSync(facesSrcPath, 'utf8');
		facesDestFile = fs.openSync(facesDestPath, "wx");
		let pathedFaces = facesSrc.replace(/fonts\//g, `${process.argv.includes('--prod') ? "./" : "/assets/"}fonts/`);
		pathedFaces = pathedFaces.replace(".icon- {", `[class^="icon-"], [class*=" icon-"] {`);
			console.log(pathedFaces);
		fs.writeSync(facesDestFile, pathedFaces, null);
		fs.closeSync(facesDestFile);
	} catch(ex) {
		fs.closeSync(facesDestFile);
		fs.rmSync(facesDestPath);
		console.error("Error encountered while converting icon font faces", ex);
	}
	cb();
}
export const copyFonts = () => {
	return gulp.src(fontsSrcPath, { encoding: false })
		.pipe(gulp.dest(fontsDestPath));
}
export const processIconFonts = gulp.series(processFontFaces, copyFonts);