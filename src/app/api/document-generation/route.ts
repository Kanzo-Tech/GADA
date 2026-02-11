import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

function sanitizeFilename(name: string): string {
    return name.replace(/[^\w.-]/g, "_");
}

function expressionParser(tag: string) {
    return {
        get: function (scope: any, context: any) {
            if (tag === '.') return scope;

            const value = tag.split('.').reduce(function (prev, curr) {
                return prev ? prev[curr] : undefined;
            }, scope);

            if (typeof value === 'string' && value.trim().length === 0) {
                return undefined;
            }

            return value;
        }
    };
}

/**
 * Generate document
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
    console.log("HIT /api/document-generation");

    try {
        let { cfg: data } = await request.json();
        const tempFolder = path.join(process.cwd(), 'temp');
        const versionValue = data.version;
        const documentToBeGenerated = Array.isArray(data.docTypes) ? data.docTypes[0] : data.docTypes;

        if (documentToBeGenerated == "dataspace-rb") {
            const templateRouteRulebook = path.join(process.cwd(), 'templates', 'Template_Rulebook_v1.docx');
            const rulebookContent = fs.readFileSync(templateRouteRulebook, 'binary');
            const rulebookZip = new PizZip(rulebookContent);
            const rulebookDoc = new Docxtemplater(rulebookZip, {
                paragraphLoop: true,
                linebreaks: true,
                parser: expressionParser,
                delimiters: { start: '[[', end: ']]' },
                nullGetter: function (field) {
                    return "___";
                }
            });
            try {
                await rulebookDoc.renderAsync(data);
            } catch (error) {
                console.error("Error while generating the docs: ", error);
                return NextResponse.json({ error: 'Error while generating the documents' }, { status: 500 });
            }

            const wordRulebookGenerated = rulebookDoc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            const nameRulebookWord = 'Rulebook_' + versionValue + '.docx';
            const safeName = sanitizeFilename(nameRulebookWord)
            const storageRouteRulebook = path.join(tempFolder, safeName);

            // Crear carpeta temp si no existe
            if (!fs.existsSync(tempFolder)) {
                fs.mkdirSync(tempFolder, { recursive: true });
            }
            fs.writeFileSync(storageRouteRulebook, wordRulebookGenerated);

            const fileArray = new Uint8Array(wordRulebookGenerated);

            // return NextResponse.json({ status: 200 })
            return new NextResponse(fileArray, {  //! logica de descarga
                status: 200,
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "Content-Disposition": `attachment; filename="${safeName}"`,
                    "Filename": safeName,
                    "Access-Control-Expose-Headers": "Filename",

                },
            })
        }


        if (documentToBeGenerated == "membership-agreement") {
            const templateRouteContract = path.join(process.cwd(), 'templates', 'Contrato_Adhesion_Institucional_v1.docx');
            const contractContent = fs.readFileSync(templateRouteContract, 'binary');
            const contractZip = new PizZip(contractContent);
            const contractDoc = new Docxtemplater(contractZip, {
                paragraphLoop: true,
                linebreaks: true,
                parser: expressionParser,
                delimiters: { start: '[[', end: ']]' },
                nullGetter: function (field) {
                    return "___";
                }
            });
            try {
                await contractDoc.renderAsync(data);
            } catch (error) {
                console.error("Error while generating the docs: ", error);
                return NextResponse.json({ error: 'Error while generating the documents' }, { status: 500 });
            }

            const wordContractGenerated = contractDoc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            const nameContractWord = 'Contrato_Adhesion_Institucional_' + versionValue + '.docx';
            const safeName = sanitizeFilename(nameContractWord)
            const storageRouteContract = path.join(tempFolder, safeName);

            // Crear carpeta temp si no existe
            if (!fs.existsSync(tempFolder)) {
                fs.mkdirSync(tempFolder, { recursive: true });
            }
            fs.writeFileSync(storageRouteContract, wordContractGenerated);

            const fileArray = new Uint8Array(wordContractGenerated);

            // return NextResponse.json({ status: 200 })
            return new NextResponse(fileArray, {  //! logica de descarga
                status: 200,
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "Content-Disposition": `attachment; filename="${safeName}"`,
                    "Filename": safeName,
                    "Access-Control-Expose-Headers": "Filename",

                },
            })
        }

        if (documentToBeGenerated == "general-tc") {
            const templateRouteTerms = path.join(process.cwd(), 'templates', 'Terminos_y_Condiciones_Template_v1.docx');
            const termsContent = fs.readFileSync(templateRouteTerms, 'binary');
            const termsZip = new PizZip(termsContent);
            const termsDoc = new Docxtemplater(termsZip, {
                paragraphLoop: true,
                linebreaks: true,
                parser: expressionParser,
                delimiters: { start: '[[', end: ']]' },
                nullGetter: function (field) {
                    return "___";
                }
            });
            try {
                await termsDoc.renderAsync(data);
            } catch (error) {
                console.error("Error while generating the docs: ", error);
                return NextResponse.json({ error: 'Error while generating the documents' }, { status: 500 });
            }

            const wordTermsGenerated = termsDoc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });
            const nameTermsWord = 'Terminos_y_Condiciones_' + versionValue + '.docx';
            const safeName = sanitizeFilename(nameTermsWord)
            const storageRouteTerms = path.join(tempFolder, safeName);

            // Crear carpeta temp si no existe
            if (!fs.existsSync(tempFolder)) {
                fs.mkdirSync(tempFolder, { recursive: true });
            }
            fs.writeFileSync(storageRouteTerms, wordTermsGenerated);

            const fileArray = new Uint8Array(wordTermsGenerated);

            // return NextResponse.json({ status: 200 })
            return new NextResponse(fileArray, {  //! logica de descarga
                status: 200,
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "Content-Disposition": `attachment; filename="${safeName}"`,
                    "Filename": safeName,
                    "Access-Control-Expose-Headers": "Filename",

                },
            })
        }

        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}