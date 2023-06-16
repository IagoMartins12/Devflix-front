import profileService from "@/src/services/profileService";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import styles from "../../../../styles/profile.module.scss"
import ToastComponent from "../../commom/toast";

const PasswordForm = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [color, setColor] = useState("")
    const [toastIsOpen, setToastIsOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(()=> {
        profileService.fetchCurrent().then((password) => {
            setCurrentPassword(password.currentPassword)
            setNewPassword(password.newPassword)

        })
    }, [])

    const handlePasswordUpdate = async function (event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    
        if (newPassword != confirmPassword) {
            setToastIsOpen(true);
            setErrorMessage("Senha e confirmação de senha diferentes!");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 1000 * 3);
            return;
        }

        if (currentPassword === newPassword) {
            setToastIsOpen(true);
            setErrorMessage("Senha atual é identica a senha antiga! ");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 1000 * 3);
            return;
        }

        if (currentPassword.length < 6  || confirmPassword.length < 6 || newPassword.length < 6 ){
            setToastIsOpen(true)
            setColor("bg-danger");
            setTimeout(() => { 
                setToastIsOpen(false)
            }, 1000 * 3)
            setErrorMessage("Por favor, inserir uma senha que contenha de 6 a 20 digitos ")
            return
        }

        const res = await profileService.passwordUpdate({currentPassword, newPassword})
        if (res === 204){
            setToastIsOpen(true);
            setErrorMessage("Senha alterada com sucesso!");
            setColor("bg-success");
            setTimeout(() => setToastIsOpen(false), 1000 * 3);
            
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }

        if (res === 400) {
            setToastIsOpen(true);
            setErrorMessage("Senha atual incorreta!");
            setColor("bg-danger");
            setTimeout(() => setToastIsOpen(false), 1000 * 3);
        }
    };

    return (
        <>
            <Form onSubmit={handlePasswordUpdate} className={styles.form}>
                <div className={styles.inputNormalDiv}>
                    <FormGroup>
                        <Label className={styles.label} for="currentPassword"> SENHA ATUAL </Label>
                        <Input name="currentPassword" type="password" id="currentPassword" placeholder="*******" required value={currentPassword} onChange={(event)=>{setCurrentPassword(event.currentTarget.value)}}
                        className={styles.input}/>
                    </FormGroup>
                </div>
                <div className={styles.inputFlexDiv}>
                    <FormGroup>
                        <Label className={styles.label} for="newPassword"> NOVA SENHA </Label>
                        <Input name="newPassword" type="password" id="newPassword" placeholder="*******" required value={newPassword} onChange={(event)=>{setNewPassword(event.currentTarget.value)}}
                        className={styles.inputFlex}/>
                    </FormGroup>

                    <FormGroup>
                        <Label className={styles.label} for="confirmNewPassword"> CONFIRMAR NOVA SENHA </Label>
                        <Input name="confirmNewPassword" type="password" id="confirmNewPassword" placeholder="*******" required value={confirmPassword} onChange={(event)=>{setConfirmPassword(event.currentTarget.value)}}
                        className={styles.inputFlex}/>
                    </FormGroup>
                </div>
                <Button className={styles.formBtn} type="submit" outline>
                    Salvar alterações
                </Button>
            </Form>
            <ToastComponent color={color} isOpen= {toastIsOpen} message = {errorMessage} />
        </>
    )
}

export default PasswordForm