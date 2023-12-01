import crypto from 'crypto';

const sha1 = (data: string): string => {
    const hash = crypto.createHash('sha1');
    hash.update(data);
    return hash.digest('hex');
}

const generateToken = (): string => {
    return crypto.randomUUID();
}

export default { sha1, generateToken };