declare module '@exodus/schemasafe' {
    function validator(schema: JSON): ValidateFunc;
    type ValidateFunc = (data: any) => boolean;
}
